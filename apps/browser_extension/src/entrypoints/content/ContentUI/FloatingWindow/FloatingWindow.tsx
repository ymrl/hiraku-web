import { createI18n } from "@wxt-dev/i18n";
import { use } from "react";
import { TabNavigation } from "@/components/TabNavigation";
import { ExtensionContext } from "../../ExtensionContext";
import { HeadingsPanel } from "./HeadingsPanel";
import { LandmarksPanel } from "./LandmarksPanel";
import { SpeechPanel } from "./SpeechPanel";
import { TextStylePanel } from "./TextStylePanel";

const { t } = createI18n();

export function FloatingWindow({
  activeTab,
  onTabChange,
  onClose,
}: {
  activeTab: "headings" | "landmarks" | "text" | "speech";
  onTabChange: (tab: "headings" | "landmarks" | "text" | "speech") => void;
  onClose: () => void;
}) {
  const { updateXpaths } = use(ExtensionContext);

  const scrollToElement = async (xpaths: string[]) => {
    updateXpaths(xpaths);
    onClose();
  };

  return (
    <div className="w-96 max-w-dvw border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-900 flex flex-col shadow-md shadow-black/10 dark:shadow-white/10 rounded-lg">
      <div className="bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200 dark:border-stone-600 px-2 py-1 flex items-center justify-between">
        <h1 className="text-sm font-bold">{t("extensionName")}</h1>
        <button
          type="button"
          className="p-1 rounded-full hover:scale-110 transition-all hover:bg-stone-300 dark:hover:bg-stone-700 hover:text-rose-600 dark:hover:text-rose-300 before:content-[''] before:block before:absolute before:-top-1 before:-right-2 before:w-11 before:h-8 relative"
          onClick={onClose}
        >
          <svg
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-4 h-4"
          >
            <title>{t("Close")}</title>
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      <TabNavigation activeTab={activeTab} onTabChange={onTabChange} />
      <div className="flex-1 overflow-y-auto">
        {activeTab === "headings" && (
          <HeadingsPanel onScrollToElement={scrollToElement} />
        )}

        {activeTab === "landmarks" && (
          <LandmarksPanel onScrollToElement={scrollToElement} />
        )}

        {activeTab === "text" && <TextStylePanel />}

        {activeTab === "speech" && <SpeechPanel />}
      </div>
    </div>
  );
}
