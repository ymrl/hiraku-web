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

  useEffect(() => {
    const loadSavedTab = async () => {
      try {
        const result = await browser.storage.local.get("activeTab");
        if (result.activeTab) {
          setActiveTab(result.activeTab);
        }
      } catch (err) {
        console.error("Failed to load saved tab:", err);
      }
    };
    loadSavedTab();
  }, []);

  const handleTabChange = async (tab: "headings" | "landmarks") => {
    setActiveTab(tab);
    try {
      await browser.storage.local.set({ activeTab: tab });
    } catch (err) {
      console.error("Failed to save tab preference:", err);
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
      <header className="p-0 border-b border-rose-200 dark:border-stone-700">
        <h1 className="pt-2 px-2 text-sm font-bold text-rose-800 dark:text-rose-300">
          raku-web
        </h1>
        <TabNavigation activeTab={activeTab} onTabChange={handleTabChange} />
      </header>

      <div className=" overflow-y-auto">
        {activeTab === "headings" && (
          <HeadingsList
            headings={pageStructure?.headings || []}
            onScrollToElement={scrollToElement}
          />
        )}

        {activeTab === "landmarks" && (
          <LandmarksList
            landmarks={pageStructure?.landmarks || []}
            onScrollToElement={scrollToElement}
          />
        )}
      </div>
    </div>
  );
}

export default App;
