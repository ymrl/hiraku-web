import { useCallback, useEffect, useState } from "react";
import { browser } from "wxt/browser";
import { Highlight } from "./Highlight";

const focusableSelector =
  "a,button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex],[contenteditable=true]";

const getFocusableElement = (element: Element): HTMLElement => {
  if (element.matches(focusableSelector)) {
    return element as HTMLElement;
  }
  const focusableChild = element.querySelector<HTMLElement>(focusableSelector);
  if (focusableChild) {
    const rect = element.getBoundingClientRect();
    const childRect = focusableChild.getBoundingClientRect();
    console.log(rect, childRect);
    if (childRect.top - rect.top <= window.innerHeight / 2) {
      return focusableChild;
    }
  }
  const emptySpan = document.createElement("span");
  emptySpan.setAttribute("tabindex", "-1");
  element.prepend(emptySpan);
  emptySpan.focus();
  emptySpan.onblur = () => {
    emptySpan.remove();
  };
  return emptySpan;
};

const focusTargetElement = (element: Element) => {
  const rect = element.getBoundingClientRect();
  const block = rect.height > window.innerHeight ? "start" : "center";
  element.scrollIntoView({ behavior: "smooth", block });
  const timeout = setTimeout(() => {
    listener();
  }, 1000);
  const listener = () => {
    getFocusableElement(element).focus();
    window.removeEventListener("scrollend", listener);
    clearTimeout(timeout);
  };
  window.addEventListener("scrollend", listener, { once: true });
};

// xpaths配列から要素を取得する関数
const getElementByXPaths = (xpaths: string[]): Element | null => {
  if (xpaths.length === 0) return null;

  // 最初のxpathでトップレベルの要素を取得
  let currentDoc: Document | null = document;
  let element: Element | null = null;

  for (let i = 0; i < xpaths.length; i++) {
    const xpath = xpaths[i];
    element = currentDoc.evaluate(
      xpath,
      currentDoc,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null,
    ).singleNodeValue as Element | null;

    if (!element) return null;

    // 最後の要素でなければ、次のframeのcontentDocumentを取得
    if (i < xpaths.length - 1) {
      const frameElement = element as HTMLIFrameElement | HTMLFrameElement;
      currentDoc = frameElement.contentDocument;
      if (!currentDoc) return null;
    }
  }

  return element;
};

export const LandmarkNavigation = () => {
  const [highlightRect, setHighlightRect] = useState<{
    top: number;
    left: number;
    width: number;
    height: number;
  } | null>(null);

  const highlightElement = useCallback((xpaths: string[]) => {
    const element = getElementByXPaths(xpaths);
    if (element) {
      const rect = element.getBoundingClientRect();
      setHighlightRect({
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
        height: rect.height,
      });
      focusTargetElement(element);
      return element;
    }
    return undefined;
  }, []);

  const clearHighlight = useCallback(() => {
    setHighlightRect(null);
  }, []);

  useEffect(() => {
    browser.runtime.onMessage.addListener((message, _sender, sendResponse) => {
      if (message.action === "scrollToElement") {
        const targetElement = highlightElement(message.xpaths);
        sendResponse({ success: !!targetElement });
      }
    });
  }, [highlightElement]);

  return (
    <>
      {highlightRect && (
        <Highlight {...highlightRect} onClose={clearHighlight} />
      )}
    </>
  );
};
