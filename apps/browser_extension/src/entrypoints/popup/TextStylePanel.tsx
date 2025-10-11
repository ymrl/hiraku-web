import { useRef, useState } from "react";
import { browser } from "wxt/browser";
import { getCurrentTabId } from "@/browser/getCurrentTabId";
import { TextStyle } from "@/components/TextStyle";
import { sendMessageToTab } from "@/ExtensionMessages";
import { loadDefaultTextStyleSettings, loadHostTextStyle } from "@/TextStyle";
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
const removeHostSettings = async (host: string) => {
  if (!host) {
    return;
  }
  // ページの設定を削除
  await browser.storage.local.remove(`textStyle_${host}`);
};

const saveHostTextStyle = async (host: string, settings: TextStyleSettings) => {
  if (!host) {
    return;
  }
  try {
    await browser.storage.local.set({
      [`textStyle_${host}`]: settings,
    });
  } catch (err) {
    console.error("Failed to save text style settings:", err);
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
      currentTabHost={currentTabHost}
      currentTextStyle={currentTextStyle}
      pageDefaultTextStyle={pageDefaultTextStyle}
      onChangeTextStyle={(style) => {
        sendSettingsToContentScript(style);
        saveHostTextStyle(currentTabHost, style);
      }}
      onResetToDefaults={async () => {
        await removeHostSettings(currentTabHost);
        const defaults = await loadDefaultTextStyleSettings();
        setCurrentTextStyle(defaults);
        sendSettingsToContentScript(defaults || {});
      }}
    />
  );
};
