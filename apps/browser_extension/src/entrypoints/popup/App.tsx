import { createI18n } from "@wxt-dev/i18n";
import { useEffect, useState } from "react";
import { getCurrentTabId } from "@/browser/getCurrentTabId";
import { TabNavigation } from "@/components/TabNavigation";
import { TextCSS } from "@/components/TextCSS";
import {
  addListener,
  type MessageListener,
  removeListener,
  sendMessageToTab,
} from "@/ExtensionMessages";
import type { SelectTab } from "@/ExtensionMessages/Popup";
import {
  type ExtensionTab,
  loadActiveTab,
  loadDefaultTextStyleSettings,
  saveActiveTab,
} from "@/storage";
import type { TextStyleSettings } from "../../types";
import { SpeechPanel } from "./SpeechPanel";
import { TableOfContentsPanel } from "./TableOfContentsPanel";
import { TextStylePanel } from "./TextStylePanel";

const { t } = createI18n();

function App() {
  const [activeTab, setActiveTab] = useState<ExtensionTab>("tableOfContents");
  const [textStyleSettings, setTextStyleSettings] = useState<TextStyleSettings>(
    {},
  );

  useEffect(() => {
    const listener: MessageListener<SelectTab> = (
      message,
      _sender,
      sendResponse,
    ) => {
      const { action } = message;
      if (action === "selectTab") {
        const { tab } = message;
        setActiveTab(tab);
        saveActiveTab(tab);
        sendResponse({ action, tab, success: true });
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
      const defaultTextStyle = await loadDefaultTextStyleSettings();
      if (defaultTextStyle) {
        setTextStyleSettings(defaultTextStyle);
      }
      const activeTab = await loadActiveTab();
      setActiveTab(activeTab);
    };
    loadSavedSettings();
  }, []);

  const handleTabChange = async (
    tab: "tableOfContents" | "text" | "speech",
  ) => {
    setActiveTab(tab);
    await saveActiveTab(tab);
    const tabId = await getCurrentTabId();
    if (tabId) {
      await sendMessageToTab(tabId, { action: "selectedTab", tab });
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

      {activeTab === "tableOfContents" && (
        <TableOfContentsPanel onScrollToElement={scrollToElement} />
      )}

      {activeTab === "text" && <TextStylePanel />}

      {activeTab === "speech" && <SpeechPanel />}
    </div>
  );
}

export default App;
