import { useRef, useState } from "react";
import { browser } from "wxt/browser";
import { getCurrentTabId } from "@/browser/getCurrentTabId";
import { TextStyle } from "@/components/TextStyle";
import { sendMessageToTab } from "@/ExtensionMessages";
import {
  loadDefaultTextStyleSettings,
  loadHostTextStyle,
  removeHostTextStyle,
  saveHostTextStyle,
} from "@/storage";
import type { TextStyleSettings } from "@/types";

const getHost = async () => {
  try {
    const [tab] = await browser.tabs.query({
      active: true,
      currentWindow: true,
    });
    if (tab?.url) {
      const url = new URL(tab.url);
      return url.hostname;
    }
  } catch (err) {
    console.error("Failed to get tab host:", err);
  }
  return undefined;
};

const sendSettingsToContentScript = async (settings: TextStyleSettings) => {
  const tabId = await getCurrentTabId();
  if (tabId) {
    sendMessageToTab(tabId, {
      action: "updateTextStyle",
      settings: settings,
    });
  }
};

const getPageDefaultTextStyle = async () => {
  try {
    const tabId = await getCurrentTabId();
    if (!tabId) return;
    const { pageTextStyle } = await sendMessageToTab(tabId, {
      action: "getPageTextStyle",
    });
    return pageTextStyle;
  } catch (err) {
    console.error("Failed to load page default settings:", err);
  }
};

export const TextStylePanel = () => {
  const [currentTabHost, setCurrentTabHost] = useState<string>("");
  const [currentTextStyle, setCurrentTextStyle] = useState<
    TextStyleSettings | undefined
  >(undefined);
  const [pageDefaultTextStyle, setPageDefaultTextStyle] = useState<
    TextStyleSettings | undefined
  >(undefined);

  const load = async () => {
    const host = await getHost();
    if (!host) {
      return;
    }
    setCurrentTabHost(host);
    const hostTextStyle = await loadHostTextStyle(host);
    if (hostTextStyle) {
      setCurrentTextStyle(hostTextStyle);
    }
    const pageDefaults = await getPageDefaultTextStyle();
    if (pageDefaults) {
      setPageDefaultTextStyle(pageDefaults);
    }
  };
  const loadedRef = useRef(false);
  if (loadedRef.current === false) {
    loadedRef.current = true;
    load();
  }

  return (
    <TextStyle
      currentTextStyle={currentTextStyle}
      pageDefaultTextStyle={pageDefaultTextStyle}
      onChangeTextStyle={(style) => {
        sendSettingsToContentScript(style);
        saveHostTextStyle(currentTabHost, style);
      }}
      onResetToDefaults={async () => {
        await removeHostTextStyle(currentTabHost);
        const defaults = await loadDefaultTextStyleSettings();
        setCurrentTextStyle(defaults);
        sendSettingsToContentScript(defaults || {});
      }}
    />
  );
};
