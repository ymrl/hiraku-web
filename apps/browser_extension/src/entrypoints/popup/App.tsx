import { createI18n } from "@wxt-dev/i18n";
import { useCallback, useEffect, useState } from "react";
import { browser } from "wxt/browser";
import type { Heading, Landmark } from "../../types";

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
    <div className="w-96 bg-white dark:bg-stone-900">
      <header className="p-0 border-b border-rose-200 dark:border-stone-700">
        <h1 className="pt-2 px-2 text-sm font-bold text-rose-800 dark:text-rose-300">
          raku-web
        </h1>
        <nav className="mt-2">
          <div className="flex space-x-1 p-1 bg-stone-100 dark:bg-stone-800">
            <button
              type="button"
              onClick={() => handleTabChange("headings")}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                activeTab === "headings"
                  ? "bg-white text-rose-600 shadow-sm dark:bg-stone-600 dark:text-rose-400"
                  : "text-stone-600 hover:text-stone-800 dark:text-stone-300 dark:hover:text-stone-100"
              }`}
            >
              {t("headings")}
            </button>
            <button
              type="button"
              onClick={() => handleTabChange("landmarks")}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                activeTab === "landmarks"
                  ? "bg-white text-rose-600 shadow-sm dark:bg-stone-600 dark:text-rose-400"
                  : "text-stone-600 hover:text-stone-800 dark:text-stone-300 dark:hover:text-stone-100"
              }`}
            >
              {t("landmarks")}
            </button>
          </div>
        </nav>
      </header>

      <div className="max-h-96 overflow-y-auto">
        {activeTab === "headings" && (
          <section className="px-1 py-2">
            {pageStructure?.headings.length ? (
              <ul className="space-y-1">
                {pageStructure.headings.map((heading, index) => (
                  <li
                    key={`${index}-${heading}`}
                    className="flex items-stretch flex-col"
                  >
                    <button
                      type="button"
                      onClick={() => scrollToElement(heading.xpath)}
                      className="text-left text-sm text-stone-800 dark:text-stone-200  hover:text-rose-800 dark:hover:text-rose-100  dark:hover:bg-stone-800 transition-colors py-2 px-2 rounded border-2 border-transparent hover:border-rose-300 dark:hover:border-rose-400 cursor-pointer flex items-center space-x-2"
                    >
                    <span className="flex-shrink-0 inline-flex items-center justify-center w-6 h-6 text-sm font-medium text-stone-700 dark:text-stone-300 border border-rose-200 dark:border-rose-300  rounded">
                      {heading.level}
                    </span>
                    <span className="text-left text-base">
                      {heading.text}
                    </span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-stone-500 dark:text-stone-400">
                {t("noHeadings")}
              </p>
            )}
          </section>
        )}

        {activeTab === "landmarks" && (
          <section className="p-4">
            {pageStructure?.landmarks.length ? (
              <ul className="space-y-2">
                {pageStructure.landmarks.map((landmark, index) => (
                  <li
                    key={`${index}-${landmark}`}
                    className="p-3 bg-stone-50 dark:bg-stone-700 rounded-lg border border-stone-200 dark:border-stone-600 hover:bg-rose-50 dark:hover:bg-stone-600 hover:border-rose-200 dark:hover:border-rose-500 cursor-pointer transition-all"
                  >
                    <button
                      type="button"
                      onClick={() => scrollToElement(landmark.xpath)}
                      className="w-full text-left"
                    >
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-medium text-stone-600 dark:text-stone-300">
                          {t("role")}:
                        </span>
                        <span className="text-sm text-stone-800 dark:text-stone-200 hover:text-rose-600 dark:hover:text-rose-400">
                          {landmark.role}
                        </span>
                      </div>
                      {landmark.label && (
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-xs font-medium text-stone-600 dark:text-stone-300">
                            {t("label")}:
                          </span>
                          <span className="text-sm text-stone-700 dark:text-stone-200">
                            {landmark.label}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs font-medium text-stone-600 dark:text-stone-300">
                          {t("tag")}:
                        </span>
                        <span className="text-xs text-stone-500 dark:text-stone-400">
                          &lt;{landmark.tag}&gt;
                        </span>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-stone-500 dark:text-stone-400">
                {t("noLandmarks")}
              </p>
            )}
          </section>
        )}
      </div>
    </div>
  );
}

export default App;
