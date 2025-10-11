import { use } from "react";
import { TabNavigation } from "@/components/TabNavigation";
import { ExtensionContext } from "../../ExtensionContext";
import { HeadingsPanel } from "./HeadingsPanel";
import { LandmarksPanel } from "./LandmarksPanel";
import { SpeechPanel } from "./SpeechPanel";
import { TextStylePanel } from "./TextStylePanel";

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
    <div className="w-96 bg-white dark:bg-stone-900 flex flex-col shadow-lg rounded-lg overflow-hidden">
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
