import { useEffect, useState } from "react";
import { browser } from "wxt/browser";
import { getCurrentTabId } from "@/browser/getCurrentTabId";
import { TextCSS } from "@/components/TextCSS";
import type { TextStyleSettings } from "../../types";
import { HeadingsList } from "./HeadingsList";
import { LandmarksList } from "./LandmarksList";
import { TabNavigation } from "./TabNavigation";
import { TextStyle } from "./TextStyle";

function App() {
  const [activeTab, setActiveTab] = useState<"headings" | "landmarks" | "text">(
    "headings",
  );
  const [currentTabHost, setCurrentTabHost] = useState<string>("");
  const [textStyleSettings, setTextStyleSettings] = useState<TextStyleSettings>(
    {},
  );

  useEffect(() => {
    const loadSavedSettings = async () => {
      try {
        // アクティブタブの取得
        const [tab] = await browser.tabs.query({
          active: true,
          currentWindow: true,
        });

        if (tab?.url) {
          const url = new URL(tab.url);
          const host = url.hostname;
          setCurrentTabHost(host);

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
        }
      } catch (err) {
        console.error("Failed to load saved settings:", err);
      }
    };
    loadSavedSettings();
  }, []);

  const handleTabChange = async (tab: "headings" | "landmarks" | "text") => {
    setActiveTab(tab);
    try {
      await browser.storage.local.set({ activeTab: tab });
    } catch (err) {
      console.error("Failed to save tab preference:", err);
    }
  };

  const scrollToElement = async (xpath: string) => {
    try {
      const tabId = await getCurrentTabId();

      if (!tabId) {
        throw new Error("No active tab found");
      }
      const result = await browser.tabs.sendMessage(tabId, {
        action: "scrollToElement",
        xpath: xpath,
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
        <h1 className=" sr-only">raku-web</h1>
        <TabNavigation activeTab={activeTab} onTabChange={handleTabChange} />
      </header>

      {activeTab === "headings" && (
        <HeadingsList onScrollToElement={scrollToElement} />
      )}

      {activeTab === "landmarks" && (
        <LandmarksList onScrollToElement={scrollToElement} />
      )}

      {activeTab === "text" && <TextStyle currentTabHost={currentTabHost} />}
    </div>
  );
}

export default App;
