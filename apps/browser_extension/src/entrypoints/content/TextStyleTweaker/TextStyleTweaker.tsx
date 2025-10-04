import { useCallback, useEffect, useRef, useState } from "react";
import { TextCSS } from "@/components/TextCSS";
import {
  addListener,
  type GetPageTextStyle,
  type MessageListener,
  removeListener,
  sendMessage,
  type UpdateTextStyle,
} from "@/ExtensionMessages";
import type { TextStyleSettings } from "../../../types";
export const TextStyleTweaker = () => {
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
      const { settings } = await sendMessage({
        action: "getHostTextStyleSettings",
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
    const listener: MessageListener<UpdateTextStyle | GetPageTextStyle> = (
      message,
      _sender,
      sendResponse,
    ) => {
      const { action } = message;
      if (action === "updateTextStyle") {
        applyTextStyleSettings(message.settings);
        sendResponse({ action, success: true });
        return true;
      }
      if (action === "getPageTextStyle") {
        sendResponse({ action, pageTextStyle: defaultSettingsRef.current });
        return true;
      }
    };
    addListener(listener);
    return () => {
      removeListener(listener);
    };
  }, [applyTextStyleSettings]);

  return <TextCSS settings={settings} />;
};
