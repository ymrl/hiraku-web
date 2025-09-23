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
    return focusableChild;
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
  element.scrollIntoView({ behavior: "smooth", block: "start" });
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

export const LandmarkNavigation = () => {
  const [highlightRect, setHighlightRect] = useState<{
    top: number;
    left: number;
    width: number;
    height: number;
  } | null>(null);

  const highlightElement = useCallback((xpath: string) => {
    const element = document.evaluate(
      xpath,
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null
    ).singleNodeValue as Element | null;
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
        const targetElement = highlightElement(message.xpath);
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
