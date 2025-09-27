import { createI18n } from "@wxt-dev/i18n";
import { useEffect, useState } from "react";
import { browser } from "wxt/browser";
import { getCurrentTabId } from "@/browser/getCurrentTabId";
import type { Landmark } from "../../types";

const { t } = createI18n();

interface LandmarksListProps {
  onScrollToElement: (xpath: string) => void;
}

const getLandmarks = async (): Promise<Landmark[]> => {
  try {
    const tabId = await getCurrentTabId();
    if (!tabId) {
      return [];
    }
    const response = await browser.tabs.sendMessage(tabId, {
      action: "getLandmarks",
    });
    if (response?.landmarks) {
      return response.landmarks;
    }
    return [];
  } catch (err) {
    console.error("Failed to get landmarks from content script:", err);
    return [];
  }
};
export function LandmarksList({
  // landmarks,
  onScrollToElement,
}: LandmarksListProps) {
  const [loading, setLoading] = useState(true);
  const [landmarks, setLandmarks] = useState<Landmark[]>([]);

  useEffect(() => {
    getLandmarks().then((landmarks) => {
      setLoading(false);
      setLandmarks(landmarks);
    });
  }, []);

  return (
    <section className="flex flex-col">
      {loading ? (
        <div className="h-32 flex justify-center items-center">
          <p className="text-sm text-stone-500 dark:text-stone-400">
            {t("loading")}
          </p>
        </div>
      ) : landmarks.length ? (
        <ul className="space-y-1 p-1 min-h-32">
          {landmarks.map((landmark, index) => (
            <li
              key={`${index}-${landmark}`}
              className="flex items-stretch flex-col"
            >
              <button
                type="button"
                onClick={() => onScrollToElement(landmark.xpath)}
                className="text-left text-sm text-stone-800 dark:text-stone-200
                    hover:text-rose-800 dark:hover:text-rose-100
                    hover:bg-rose-50
                    dark:hover:bg-stone-800 transition-colors
                    rounded-lg border-2 border-transparent
                    hover:border-rose-300 dark:hover:border-rose-400
                    cursor-pointer
                    py-2 px-2 space-x-2"
              >
                <span className="text-base">
                  {landmark.label || t(`landmarkroles.${landmark.role}`)}
                </span>
                {landmark.label && (
                  <span className="text-sm">
                    {" "}
                    ({t(`landmarkroles.${landmark.role}`)})
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <div className="h-32 flex justify-center items-center">
          <p className="text-sm text-stone-500 dark:text-stone-400">
            {t("noLandmarks")}
          </p>
        </div>
      )}
    </section>
  );
}
