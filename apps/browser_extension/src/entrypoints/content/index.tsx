import { computeAccessibleName, getRole } from "dom-accessibility-api";
import getXPath from "get-xpath";
import { browser } from "wxt/browser";
import { defineContentScript } from "wxt/utils/define-content-script";
import { LANDMARK_ROLES } from "@/constants";
import type { Heading, Landmark } from "../../types";
import { createRootElement } from "./Root";
import { isHidden } from "@/utils/isHidden";
import { isAriaHidden } from "@/utils/isAriaHidden";

const landmarkSelectors = [
  "header",
  "nav",
  "main",
  "aside",
  "footer",
  "section",
  '[role="banner"]',
  '[role="navigation"]',
  '[role="main"]',
  '[role="complementary"]',
  '[role="contentinfo"]',
  '[role="search"]',
  '[role="form"]',
  '[role="region"]',
];

function getHeadings(): Heading[] {
  const headingElements = document.querySelectorAll(
    "h1, h2, h3, h4, h5, h6, [role='heading']",
  );
  return [...headingElements]
    .map<Heading | undefined>((element, index) => {
      if (isHidden(element) || isAriaHidden(element)) {
        return undefined;
      }
      const text = element.textContent?.trim() || "";
      if (!text) return undefined;
      const tagName = element.tagName.toLowerCase();
      const level = tagName.match(/^h[1-6]$/)
        ? parseInt(element.tagName.substring(1), 10)
        : parseInt(element.getAttribute("aria-level") || "2", 10);
      const id = element.id || undefined;
      const xpath = getXPath(element);
      return {
        level,
        text,
        id,
        index,
        xpath,
      };
    })
    .filter((h): h is Heading => h !== undefined);
}

function getLandmarks(): Landmark[] {
  return [
    ...document.querySelectorAll<HTMLElement>(landmarkSelectors.join(",")),
  ]
    .map<Landmark | undefined>((element, index) => {
      if (isHidden(element) || isAriaHidden(element)) {
        return undefined;
      }
      const role = getRole(element);
      if (!role || (LANDMARK_ROLES as readonly string[]).indexOf(role) === -1) {
        return undefined;
      }
      const label = computeAccessibleName(element).trim();
      if (element.tagName.toLowerCase() === "section" && !label) {
        return undefined;
      }
      const xpath = getXPath(element);
      return {
        role,
        label,
        tag: element.tagName.toLowerCase(),
        index,
        xpath,
      };
    })
    .filter((l): l is Landmark => l !== undefined);
}

export default defineContentScript({
  matches: ["<all_urls>"],
  main() {
    // DOM読み込み完了後にReact Rootを初期化
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", createRootElement);
    } else {
      createRootElement();
    }

    // ポップアップからのメッセージをリスンし、ページ情報を返す
    browser.runtime.onMessage.addListener((message, _sender, sendResponse) => {
      if (message.action === "getPageStructure") {
        const headings = getHeadings();
        const landmarks = getLandmarks();
        sendResponse({
          headings,
          landmarks,
          url: window.location.href,
          title: document.title,
        });
      }
      return true;
    });
  },
});
