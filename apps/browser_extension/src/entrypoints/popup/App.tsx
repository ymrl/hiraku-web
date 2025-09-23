import { createI18n } from "@wxt-dev/i18n";
import { useCallback, useEffect, useState } from "react";
import { browser } from "wxt/browser";
import type { Heading, Landmark } from "../../types";
import { HeadingsList } from "./HeadingsList";
import { LandmarksList } from "./LandmarksList";
import { TabNavigation } from "./TabNavigation";

const { t } = createI18n();

interface PageStructure {
  headings: Heading[];
  landmarks: Landmark[];
  url: string;
  title: string;
}

function App() {
  const [pageStructure, setPageStructure] = useState<PageStructure | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"headings" | "landmarks">(
    "headings",
  );
  const [headingLevelFilter, setHeadingLevelFilter] = useState(7);
  const [currentTabHost, setCurrentTabHost] = useState<string>("");

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
            "activeTab",
            `headingLevel_${host}`,
          ]);

          if (result.activeTab) {
            setActiveTab(result.activeTab);
          }

          if (result[`headingLevel_${host}`]) {
            setHeadingLevelFilter(result[`headingLevel_${host}`]);
          }
        }
      } catch (err) {
        console.error("Failed to load saved settings:", err);
      }
    };
    loadSavedSettings();
  }, []);

  const handleTabChange = async (tab: "headings" | "landmarks") => {
    setActiveTab(tab);
    try {
      await browser.storage.local.set({ activeTab: tab });
    } catch (err) {
      console.error("Failed to save tab preference:", err);
    }
  };

  const handleHeadingLevelFilterChange = async (level: number) => {
    setHeadingLevelFilter(level);
    if (currentTabHost) {
      try {
        await browser.storage.local.set({
          [`headingLevel_${currentTabHost}`]: level,
        });
      } catch (err) {
        console.error("Failed to save heading level filter:", err);
      }
    }
  };

  const loadPageStructure = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [tab] = await browser.tabs.query({
        active: true,
        currentWindow: true,
      });
      if (!tab?.id) {
        throw new Error("No active tab found");
      }

      const response = await browser.tabs.sendMessage(tab.id, {
        action: "getPageStructure",
      });
      setPageStructure(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPageStructure();
  }, [loadPageStructure]);

  const scrollToElement = async (xpath: string) => {
    try {
      const [tab] = await browser.tabs.query({
        active: true,
        currentWindow: true,
      });
      if (!tab?.id) return;

      const result = await browser.tabs.sendMessage(tab.id, {
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

  if (loading) {
    return (
      <div className="w-96 p-4 bg-rose-50 dark:bg-stone-900">
        <div className="text-center text-stone-600 dark:text-stone-300">
          {t("loading")}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-96 p-4 bg-rose-50 dark:bg-stone-900">
        <div className="text-center text-rose-600 dark:text-rose-400">
          {t("error")}
        </div>
        <button
          type="button"
          onClick={loadPageStructure}
          className="mt-2 w-full px-4 py-2 bg-rose-500 text-white rounded hover:bg-rose-600 dark:bg-rose-600 dark:hover:bg-rose-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="w-96 bg-white dark:bg-stone-900 flex flex-col">
      <header className="p-0 border-b border-stone-200 dark:border-stone-700">
        <h1 className=" sr-only">
          raku-web
        </h1>
        <TabNavigation activeTab={activeTab} onTabChange={handleTabChange} />
      </header>

        {activeTab === "headings" && (
          <HeadingsList
            headings={pageStructure?.headings || []}
            onScrollToElement={scrollToElement}
            levelFilter={headingLevelFilter}
            onLevelFilterChange={handleHeadingLevelFilterChange}
          />
        )}

        {activeTab === "landmarks" && (
          <LandmarksList
            landmarks={pageStructure?.landmarks || []}
            onScrollToElement={scrollToElement}
          />
        )}
    </div>
  );
}

export default App;
