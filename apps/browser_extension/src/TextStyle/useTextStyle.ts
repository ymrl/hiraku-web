import { useCallback, useEffect, useRef, useState } from "react";
import {
  addListener,
  type GetPageTextStyle,
  type MessageListener,
  removeListener,
  type UpdateTextStyle,
} from "@/ExtensionMessages";
import { loadHostTextStyle } from "@/storage";
import type { TextStyleSettings } from "@/types";

type Options = {
  onChange?: (newStyle: TextStyleSettings | undefined) => void;
};
export const useTextStyle = (options?: Options) => {
  const { onChange } = options || {};
  const [currentTextStyle, setCurrentTextStyle] = useState<
    TextStyleSettings | undefined
  >({});
  const pageDefaultTextStyleRef = useRef<TextStyleSettings | undefined>(
    undefined,
  );

  const load = useCallback(
    async (hostname: string) => {
      const settings = await loadHostTextStyle(hostname);
      setCurrentTextStyle(settings);
      onChange?.(settings);
    },
    [onChange],
  );

  const renderedOnceRef = useRef(false);
  if (!renderedOnceRef.current) {
    const defaults = getComputedStyle(document.documentElement);
    const fontSizePx = parseFloat(defaults.fontSize);
    const lineHeightPx =
      defaults.lineHeight === "normal"
        ? 1.2 * fontSizePx
        : parseFloat(defaults.lineHeight);
    const textStyle = {
      fontSize: Number.isNaN(fontSizePx) ? 1.0 : fontSizePx / 16,
      lineHeight:
        Number.isNaN(lineHeightPx) || fontSizePx === 0
          ? 1.2
          : lineHeightPx / fontSizePx,
    };
    pageDefaultTextStyleRef.current = textStyle;
    load(window.location.hostname);
    renderedOnceRef.current = true;
  }

  const updateCurrentTextStyle = useCallback(
    (newStyle: TextStyleSettings | undefined) => {
      setCurrentTextStyle(newStyle);
      onChange?.(newStyle);
    },
    [onChange],
  );

  useEffect(() => {
    const listener: MessageListener<UpdateTextStyle | GetPageTextStyle> = (
      message,
      _sender,
      sendResponse,
    ) => {
      const { action } = message;
      if (action === "updateTextStyle") {
        const { settings } = message;
        updateCurrentTextStyle(settings);
        sendResponse({ action, success: true });
        return true;
      }
      if (action === "getPageTextStyle") {
        sendResponse({
          action,
          pageTextStyle: pageDefaultTextStyleRef.current || {},
        });
        return true;
      }
    };
    addListener(listener);
    return () => {
      removeListener(listener);
    };
  }, [updateCurrentTextStyle]);

  return {
    currentTextStyle,
    pageDefaultTextStyle: pageDefaultTextStyleRef.current,
    updateCurrentTextStyle,
    load,
  };
};
