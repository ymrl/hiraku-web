import { use, useState } from "react";
import { TabNavigation } from "@/components/TabNavigation";
import { ExtensionContext } from "../../ExtensionContext";
import { HeadingsPanel } from "./HeadingsPanel";
import { LandmarksPanel } from "./LandmarksPanel";
import { SpeechPanel } from "./SpeechPanel";
import { TextStylePanel } from "./TextStylePanel";

interface FloatingPanelProps {
  initialTab?: "headings" | "landmarks" | "text" | "speech";
  onClose: () => void;
}

export function FloatingWindow({
  initialTab = "headings",
  onClose,
}: FloatingPanelProps) {
  const [activeTab, setActiveTab] = useState<
    "headings" | "landmarks" | "text" | "speech"
  >(initialTab);
  const { updateXpaths } = use(ExtensionContext);

  const scrollToElement = async (xpaths: string[]) => {
    updateXpaths(xpaths);
    onClose();
  };

  return (
    <div className="px-2 pl-4">
      <div className="w-96 bg-white dark:bg-stone-900 flex flex-col shadow-lg rounded-lg overflow-hidden">
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

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
    </div>
  );
}
