import { createI18n } from "@wxt-dev/i18n";
import type { Landmark } from "../../types";

const { t } = createI18n();

interface LandmarksListProps {
  landmarks: Landmark[];
  onScrollToElement: (xpath: string) => void;
}

export function LandmarksList({
  landmarks,
  onScrollToElement,
}: LandmarksListProps) {
  return (
    <section className="p-4">
      {landmarks.length ? (
        <ul className="space-y-1">
          {landmarks.map((landmark, index) => (
            <li
              key={`${index}-${landmark}`}
              className="p-3 bg-stone-50 dark:bg-stone-700 rounded-lg border border-stone-200 dark:border-stone-600 hover:bg-rose-50 dark:hover:bg-stone-600 hover:border-rose-200 dark:hover:border-rose-500 cursor-pointer transition-all"
            >
              <button
                type="button"
                onClick={() => onScrollToElement(landmark.xpath)}
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
  );
}
