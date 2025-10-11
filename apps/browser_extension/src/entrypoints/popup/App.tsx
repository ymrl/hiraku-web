import { createI18n } from "@wxt-dev/i18n";
import { useEffect, useState } from "react";
import { browser } from "wxt/browser";
import { getCurrentTabId } from "@/browser/getCurrentTabId";
import { TabNavigation } from "@/components/TabNavigation";
import { TextCSS } from "@/components/TextCSS";
import {
  addListener,
  type MessageListener,
  removeListener,
  sendMessageToTab,
} from "@/ExtensionMessages";
import type {
  SelectHeadingsTab,
  SelectLandmarksTab,
  SelectSpeechTab,
  SelectTextTab,
} from "@/ExtensionMessages/Popup";
import type { TextStyleSettings } from "../../types";
import { HeadingsPanel } from "./HeadingsPanel";
import { LandmarksPanel } from "./LandmarksPanel";
import { SpeechPanel } from "./SpeechPanel";
import { TextStylePanel } from "./TextStylePanel";

const { t } = createI18n();

function App() {
  const [activeTab, setActiveTab] = useState<
    "headings" | "landmarks" | "text" | "speech"
  >("headings");
  const [textStyleSettings, setTextStyleSettings] = useState<TextStyleSettings>(
    {},
  );

  useEffect(() => {
    const listener: MessageListener<
      SelectHeadingsTab | SelectLandmarksTab | SelectTextTab | SelectSpeechTab
    > = (message, _sender, sendResponse) => {
      const { action } = message;
      if (action === "selectHeadingsTab") {
        setActiveTab("headings");
        sendResponse({ action, success: true });
        return true;
      }
      if (action === "selectLandmarksTab") {
        setActiveTab("landmarks");
        sendResponse({ action, success: true });
        return true;
      }
      if (action === "selectTextTab") {
        setActiveTab("text");
        sendResponse({ action, success: true });
        return true;
      }
      if (action === "selectSpeechTab") {
        setActiveTab("speech");
        sendResponse({ action, success: true });
        return true;
      }
    };
    addListener(listener);
    return () => {
      removeListener(listener);
    };
  }, []);

  useEffect(() => {
    const loadSavedSettings = async () => {
      try {
        // 設定の読み込み
        const result = await browser.storage.local.get([
          "defaultTextStyle",
          "activeTab",
        ]);

        if (result.activeTab) {
          setActiveTab(result.activeTab);
        }

        if (result.defaultTextStyle) {
          setTextStyleSettings(result.defaultTextStyle);
        }
      } catch (err) {
        console.error("Failed to load saved settings:", err);
      }
    };
    loadSavedSettings();
  }, []);

  const handleTabChange = async (
    tab: "headings" | "landmarks" | "text" | "speech",
  ) => {
    setActiveTab(tab);
    try {
      await browser.storage.local.set({ activeTab: tab });
    } catch (err) {
      console.error("Failed to save tab preference:", err);
    }
  };

  const scrollToElement = async (xpaths: string[]) => {
    try {
      const tabId = await getCurrentTabId();

      if (!tabId) {
        throw new Error("No active tab found");
      }
      const result = await sendMessageToTab(tabId, {
        action: "scrollToElement",
        xpaths: xpaths,
      });
      if (result?.success) {
        window.close();
      }
    } catch (err) {
      console.error("Failed to scroll to heading:", err);
    }
  };

  return (
    <div className="w-96 bg-white dark:bg-stone-900 flex flex-col">
      <TextCSS settings={textStyleSettings} />
      <header className="p-0 border-b border-stone-200 dark:border-stone-700">
        <h1 className=" sr-only">{t("extensionName")}</h1>
        <TabNavigation activeTab={activeTab} onTabChange={handleTabChange} />
      </header>

      {activeTab === "headings" && (
        <HeadingsPanel onScrollToElement={scrollToElement} />
      )}

      {activeTab === "landmarks" && (
        <LandmarksPanel onScrollToElement={scrollToElement} />
      )}

      {activeTab === "text" && <TextStylePanel />}

      {activeTab === "speech" && <SpeechPanel />}
    </div>
  );
}

export default App;
