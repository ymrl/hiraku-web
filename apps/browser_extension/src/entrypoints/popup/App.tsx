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
      <div className="w-96 p-4 bg-white">
        <div className="text-center text-gray-600">{t("loading")}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-96 p-4 bg-white">
        <div className="text-center text-red-600">{t("error")}</div>
        <button
          type="button"
          onClick={loadPageStructure}
          className="mt-2 w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="w-96 bg-white">
      <header className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h1 className="text-lg font-semibold text-gray-800">{t("title")}</h1>
      </header>

      <div className="max-h-96 overflow-y-auto">
        <section className="p-4 border-b border-gray-100">
          <h2 className="text-md font-medium text-gray-700 mb-3">
            {t("headings")}
          </h2>
          {pageStructure?.headings.length ? (
            <ul className="space-y-2">
              {pageStructure.headings.map((heading, index) => (
                <li
                  key={`${index}-${heading}`}
                  className="flex items-start space-x-2"
                >
                  <span className="flex-shrink-0 inline-flex items-center justify-center w-6 h-6 text-xs font-medium text-white bg-blue-500 rounded">
                    H{heading.level}
                  </span>
                  <button
                    type="button"
                    onClick={() => scrollToElement(heading.xpath)}
                    className="text-left text-sm text-gray-800 leading-6 hover:text-blue-600 hover:underline cursor-pointer flex-1"
                  >
                    {heading.text}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">{t("noHeadings")}</p>
          )}
        </section>

        <section className="p-4">
          <h2 className="text-md font-medium text-gray-700 mb-3">
            {t("landmarks")}
          </h2>
          {pageStructure?.landmarks.length ? (
            <ul className="space-y-2">
              {pageStructure.landmarks.map((landmark, index) => (
                <li
                  key={`${index}-${landmark}`}
                  className="p-2 bg-gray-50 rounded border hover:bg-gray-100 cursor-pointer transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => scrollToElement(landmark.xpath)}
                    className="w-full text-left"
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-medium text-gray-600">
                        {t("role")}:
                      </span>
                      <span className="text-sm text-gray-800 hover:text-blue-600">
                        {landmark.role}
                      </span>
                    </div>
                    {landmark.label && (
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs font-medium text-gray-600">
                          {t("label")}:
                        </span>
                        <span className="text-sm text-gray-700">
                          {landmark.label}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs font-medium text-gray-600">
                        {t("tag")}:
                      </span>
                      <span className="text-xs text-gray-500">
                        &lt;{landmark.tag}&gt;
                      </span>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">{t("noLandmarks")}</p>
          )}
        </section>
      </div>
    </div>
  );
}

export default App;
