import React from "react";
import { createRoot } from "react-dom/client";
import { browser } from "wxt/browser";
import { defineContentScript } from "wxt/utils/define-content-script";
import type { Heading, Landmark } from "../../types";
import HighlightContainer from "./HighlightContainer";
import getXPath from "get-xpath";
import { computeAccessibleName, getRole } from "dom-accessibility-api";
import { LANDMARK_ROLES } from "@/constants";

const landmarkSelectors = [
  "header",
  "nav",
  "main",
  "aside",
  "footer",
  "section",
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
    "h1, h2, h3, h4, h5, h6, [role='heading']"
  );
  return [...headingElements]
    .map<Heading | undefined>((element, index) => {
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
      const role = getRole(element);
      if (!role || (LANDMARK_ROLES as readonly string[]).indexOf(role) === -1)
        return undefined;
      const label = computeAccessibleName(element).trim();
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

// ハイライト機能の参照
let highlightFunction: ((element: Element | null) => void) | null = null;
let reactRoot: any = null;
let overlayContainer: HTMLElement | null = null;

function initializeReactHighlight() {
  if (overlayContainer) return;

  // React Root用のコンテナを作成
  overlayContainer = document.createElement("div");
  overlayContainer.id = "page-structure-overlay-container";
  overlayContainer.style.cssText = `
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 999999;
  `;
  document.body.appendChild(overlayContainer);

  // React Rootを作成
  reactRoot = createRoot(overlayContainer);
  reactRoot.render(
    React.createElement(HighlightContainer, {
      onHighlightMount: (highlightFunc: (element: Element | null) => void) => {
        highlightFunction = highlightFunc;
      },
    })
  );
}

function highlightElement(element: Element) {
  if (!highlightFunction) {
    initializeReactHighlight();
    // 少し待ってからハイライト関数を実行
    setTimeout(() => {
      if (highlightFunction) {
        highlightFunction(element);
      }
    }, 50);
  } else {
    highlightFunction(element);
  }
}

function scrollToHeading(xpath: string) {
  const element = document.evaluate(
    xpath,
    document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  ).singleNodeValue as Element | null;
  if (element) {
    element.scrollIntoView({ behavior: "smooth", block: "center" });
    highlightElement(element);
  }
}

function scrollToLandmark(xpath: string) {
  const element = document.evaluate(
    xpath,
    document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  ).singleNodeValue as Element | null;
  if (element) {
    element.scrollIntoView({ behavior: "smooth", block: "center" });
    highlightElement(element);
  }
}

export default defineContentScript({
  matches: ["<all_urls>"],
  main() {
    // DOM読み込み完了後にReact Rootを初期化
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", initializeReactHighlight);
    } else {
      initializeReactHighlight();
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
      } else if (message.action === "scrollToHeading") {
        scrollToHeading(message.xpath);
        sendResponse({ success: true });
      } else if (message.action === "scrollToLandmark") {
        scrollToLandmark(message.xpath);
        sendResponse({ success: true });
      }
      return true;
    });

    // ページ遷移時にオーバーレイをクリーンアップ
    window.addEventListener("beforeunload", () => {
      if (reactRoot) {
        reactRoot.unmount();
        reactRoot = null;
      }
      if (overlayContainer?.parentNode) {
        overlayContainer.parentNode.removeChild(overlayContainer);
        overlayContainer = null;
      }
      highlightFunction = null;
    });
  },
});
