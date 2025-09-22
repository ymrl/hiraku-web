import React from "react";
import { createRoot } from "react-dom/client";
import HighlightContainer from "./HighlightContainer";

interface Heading {
  level: number;
  text: string;
  id?: string;
  index: number;
}

interface Landmark {
  role: string;
  label?: string;
  tag: string;
  index: number;
}

function getHeadings(): Heading[] {
  const headings: Heading[] = [];
  const headingElements = document.querySelectorAll("h1, h2, h3, h4, h5, h6");

  headingElements.forEach((element, index) => {
    const level = parseInt(element.tagName.substring(1), 10);
    const text = element.textContent?.trim() || "";
    const id = element.id || undefined;

    if (text) {
      element.setAttribute("data-page-structure-heading", index.toString());
      headings.push({ level, text, id, index });
    }
  });

  return headings;
}

function getLandmarks(): Landmark[] {
  const landmarks: Landmark[] = [];
  const processedElements = new Set<Element>();
  let landmarkIndex = 0;

  // まず、明示的なARIAロールを持つ要素を検索
  const explicitRoles = [
    "banner",
    "navigation",
    "main",
    "complementary",
    "contentinfo",
    "search",
    "form",
    "region",
  ];

  explicitRoles.forEach((roleName) => {
    const elements = document.querySelectorAll(`[role="${roleName}"]`);
    elements.forEach((element) => {
      if (!processedElements.has(element)) {
        processedElements.add(element);

        const label =
          element.getAttribute("aria-label") ||
          (element.getAttribute("aria-labelledby") &&
            document
              .getElementById(element.getAttribute("aria-labelledby")!)
              ?.textContent?.trim()) ||
          undefined;

        element.setAttribute(
          "data-page-structure-landmark",
          landmarkIndex.toString(),
        );
        landmarks.push({
          role: roleName,
          label,
          tag: element.tagName.toLowerCase(),
          index: landmarkIndex,
        });
        landmarkIndex++;
      }
    });
  });

  // 次に、HTML5セマンティック要素を検索（まだ処理されていないもの）
  const semanticElements = [
    { tag: "nav", role: "navigation" },
    { tag: "main", role: "main" },
    { tag: "header", role: "banner" },
    { tag: "footer", role: "contentinfo" },
    { tag: "aside", role: "complementary" },
  ];

  semanticElements.forEach(({ tag, role }) => {
    const elements = document.querySelectorAll(tag);
    elements.forEach((element) => {
      if (!processedElements.has(element)) {
        // header要素の特別な処理：mainやarticle、section内のheaderはbannerではない
        if (tag === "header") {
          const parent = element.closest("main, article, section");
          if (parent) {
            return; // main, article, section内のheaderはスキップ
          }
        }

        // footer要素の特別な処理：mainやarticle、section内のfooterはcontentinfoではない
        if (tag === "footer") {
          const parent = element.closest("main, article, section");
          if (parent) {
            return; // main, article, section内のfooterはスキップ
          }
        }

        processedElements.add(element);

        const label =
          element.getAttribute("aria-label") ||
          (element.getAttribute("aria-labelledby") &&
            document
              .getElementById(element.getAttribute("aria-labelledby")!)
              ?.textContent?.trim()) ||
          undefined;

        element.setAttribute(
          "data-page-structure-landmark",
          landmarkIndex.toString(),
        );
        landmarks.push({
          role,
          label,
          tag,
          index: landmarkIndex,
        });
        landmarkIndex++;
      }
    });
  });

  // 最後に、aria-labelまたはaria-labelledbyを持つsection要素を検索
  const labeledSections = document.querySelectorAll(
    "section[aria-label], section[aria-labelledby]",
  );
  labeledSections.forEach((element) => {
    if (!processedElements.has(element)) {
      processedElements.add(element);

      const label =
        element.getAttribute("aria-label") ||
        (element.getAttribute("aria-labelledby") &&
          document
            .getElementById(element.getAttribute("aria-labelledby")!)
            ?.textContent?.trim()) ||
        undefined;

      element.setAttribute(
        "data-page-structure-landmark",
        landmarkIndex.toString(),
      );
      landmarks.push({
        role: "region",
        label,
        tag: "section",
        index: landmarkIndex,
      });
      landmarkIndex++;
    }
  });

  return landmarks;
}

// ハイライト機能の管理

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
    }),
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

function scrollToHeading(headingIndex: number) {
  const element = document.querySelector(
    `[data-page-structure-heading="${headingIndex}"]`,
  );
  if (element) {
    element.scrollIntoView({ behavior: "smooth", block: "center" });
    highlightElement(element);
  }
}

function scrollToLandmark(landmarkIndex: number) {
  const element = document.querySelector(
    `[data-page-structure-landmark="${landmarkIndex}"]`,
  );
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
    browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
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
        scrollToHeading(message.index);
        sendResponse({ success: true });
      } else if (message.action === "scrollToLandmark") {
        scrollToLandmark(message.index);
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
      if (overlayContainer && overlayContainer.parentNode) {
        overlayContainer.parentNode.removeChild(overlayContainer);
        overlayContainer = null;
      }
      highlightFunction = null;
    });
  },
});
