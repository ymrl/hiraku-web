import { useCallback, useRef, useState } from "react";
import { sendMessage } from "@/ExtensionMessages";
import type { TextStyleSettings } from "@/types";
export const useTextStyle = () => {
  const [currentTextStyle, setCurrentTextStyle] = useState<
    TextStyleSettings | undefined
  >({});
  const pageDefaultTextStyleRef = useRef<TextStyleSettings | undefined>(
    undefined,
  );

  const getHostTextStyle = async (hostname: string) => {
    const { settings } = await sendMessage({
      action: "getHostTextStyleSettings",
      hostname: hostname,
    });
    setCurrentTextStyle(settings);
  };

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
    getHostTextStyle(window.location.hostname);
    renderedOnceRef.current = true;
  }

  const updateCurrentTextStyle = useCallback(
    (newStyle: TextStyleSettings | undefined) => {
      setCurrentTextStyle(newStyle);
    },
    [],
  );

  return {
    currentTextStyle,
    pageDefaultTextStyle: pageDefaultTextStyleRef.current,
    updateCurrentTextStyle,
  };
};
