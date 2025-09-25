import { useCallback, useEffect, useRef, useState } from "react";
import { browser } from "wxt/browser";
import type { TextStyleSettings } from "../../../types";
export const TextStyleTweaker = () => {
  const styleElementRef = useRef<HTMLStyleElement | null>(null);
  const defaultSettingsRef = useRef<Partial<TextStyleSettings>>({});
  const [settings, setSettings] = useState<TextStyleSettings>({});

  const applyTextStyleSettings = useCallback(
    (newSettings: TextStyleSettings) => {
      setSettings(newSettings);
    },
    [],
  );

  const loadTextStyleSettings = async () => {
    try {
      const hostname = window.location.hostname;
      const settings = await browser.runtime.sendMessage({
        action: "getTextStyleSettings",
        hostname: hostname,
      });
      if (settings) {
        applyTextStyleSettings(settings);
      }
    } catch (error) {
      console.error("Failed to load text style settings:", error);
    }
  };

  const setPageDefaultSettings = () => {
    renderedOnceRef.current = true;
    const defaults = getComputedStyle(document.documentElement);
    const fontSizePx = parseFloat(defaults.fontSize);
    const lineHeightPx =
      defaults.lineHeight === "normal"
        ? 1.2 * fontSizePx
        : parseFloat(defaults.lineHeight);
    defaultSettingsRef.current = {
      fontSize: Number.isNaN(fontSizePx) ? 1.0 : fontSizePx / 16,
      lineHeight:
        Number.isNaN(lineHeightPx) || fontSizePx === 0
          ? 1.2
          : lineHeightPx / fontSizePx,
    };
  };

  const renderedOnceRef = useRef(false);
  if (!renderedOnceRef.current) {
    setPageDefaultSettings();
    loadTextStyleSettings();
  }

  useEffect(() => {
    const listener: Parameters<
      typeof browser.runtime.onMessage.addListener
    >[0] = (message, _sender, sendResponse) => {
      if (message.action === "updateTextStyle") {
        applyTextStyleSettings(message.settings);
        sendResponse({ success: true });
      } else if (message.action === "getDefaultTextStyle") {
        sendResponse({ defaultSettings: defaultSettingsRef.current });
      }
    };
    browser.runtime.onMessage.addListener(listener);
    return () => {
      browser.runtime.onMessage.removeListener(listener);
    };
  }, [applyTextStyleSettings]);

  const { fontSize, lineHeight, paragraphSpacing, letterSpacing, wordSpacing } =
    settings;

  return (
    <style ref={styleElementRef}>
      {fontSize !== undefined && (
        <>
          :root {"{"}
          font-size: {(fontSize || 1) * 100}% !important;
          {"}"}
        </>
      )}
      {(lineHeight !== undefined ||
        letterSpacing !== undefined ||
        wordSpacing !== undefined) && (
        <>
          body, p, div, span, article, section, main, aside {"{"}
          {lineHeight !== undefined && (
            <>line-height: {lineHeight || 1.5} !important;</>
          )}
          {letterSpacing !== undefined && (
            <>letter-spacing: {letterSpacing || 0}em !important;</>
          )}
          {wordSpacing !== undefined && (
            <>word-spacing: {wordSpacing || 0}em !important;</>
          )}
          {"}"}
        </>
      )}
      {paragraphSpacing !== undefined && (
        <>
          p {"{"}
          margin-bottom: {settings.paragraphSpacing || 1}em !important;
          {"}"}p + p, div + p, section p, article p, main p {"{"}
          margin-top: {settings.paragraphSpacing || 1}em !important;
          {"}"}
        </>
      )}
    </style>
  );
};
