import { useCallback, useEffect, useRef, useState } from "react";
import { browser } from "wxt/browser";
import type { TextStyleSettings } from "../../../types";
export const TextStyleTweaker = () => {
  const styleElementRef = useRef<HTMLStyleElement | null>(null);
  const [settings, setSettings] = useState<{
    fontSize: number | undefined;
    lineHeight: number | undefined;
    paragraphSpacing: number | undefined;
    letterSpacing: number | undefined;
    wordSpacing: number | undefined;
  }>({
    fontSize: undefined,
    lineHeight: undefined,
    paragraphSpacing: undefined,
    letterSpacing: undefined,
    wordSpacing: undefined,
  });

  const applyTextStyleSettings = useCallback(
    (newSettings: TextStyleSettings) => {
      setSettings((prev) => ({ ...prev, ...newSettings }));
    },
    [],
  );

  const loadTextStyleSettings = useCallback(async () => {
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
  }, [applyTextStyleSettings]);

  const renderedOnceRef = useRef(false);
  if (!renderedOnceRef.current) {
    renderedOnceRef.current = true;
    loadTextStyleSettings();
  }

  useEffect(() => {
    const listener: Parameters<
      typeof browser.runtime.onMessage.addListener
    >[0] = (message, _sender, sendResponse) => {
      if (message.action === "updateTextStyle") {
        applyTextStyleSettings(message.settings);
        sendResponse({ success: true });
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
