import { use, useRef } from "react";
import { TextCSS } from "@/components/TextCSS";
import { ExtensionContext } from "../ExtensionContext";

export const TextStyleTweaker = () => {
  const { currentTextStyle, getHostTextStyle, applyPageDefaultTextStyle } =
    use(ExtensionContext);

  const loadTextStyleSettings = async () => {
    const hostname = window.location.hostname;
    getHostTextStyle(hostname);
  };

  const setPageDefaultSettings = () => {
    const defaults = getComputedStyle(document.documentElement);
    const fontSizePx = parseFloat(defaults.fontSize);
    const lineHeightPx =
      defaults.lineHeight === "normal"
        ? 1.2 * fontSizePx
        : parseFloat(defaults.lineHeight);
    const pageDefaultTextStyle = {
      fontSize: Number.isNaN(fontSizePx) ? 1.0 : fontSizePx / 16,
      lineHeight:
        Number.isNaN(lineHeightPx) || fontSizePx === 0
          ? 1.2
          : lineHeightPx / fontSizePx,
    };
    applyPageDefaultTextStyle(pageDefaultTextStyle);
  };

  const renderedOnceRef = useRef(false);
  if (!renderedOnceRef.current) {
    setPageDefaultSettings();
    loadTextStyleSettings();
    renderedOnceRef.current = true;
  }

  return <TextCSS settings={currentTextStyle || {}} />;
};
