import { useRef, useState } from "react";
import { browser } from "wxt/browser";
import { getCurrentTabId } from "@/browser/getCurrentTabId";
import { HeadingsList } from "@/components/HeadingsList";
import { type GetHeadings, sendMessageToTab } from "@/ExtensionMessages";
import type { Heading } from "@/types";

const loadLevelFilter = async (): Promise<number> => {
  try {
    const result = await browser.storage.local.get("headingLevel");
    if (result.headingLevel) {
      return result.headingLevel;
    }
    return 7;
  } catch (err) {
    console.error("Failed to load heading level filter:", err);
    return 7;
  }
};

const saveLevelFlter = async (levelFilter: number) => {
  try {
    browser.storage.local.set({
      headingLevel: levelFilter,
    });
  } catch (err) {
    console.error("Failed to save heading level filter:", err);
  }
};

const getHeadings = async (): Promise<Heading[]> => {
  try {
    const tabId = await getCurrentTabId();
    if (!tabId) {
      return [];
    }
    const response = await sendMessageToTab<GetHeadings>(tabId, {
      action: "getHeadings",
    });
    if (response?.headings) {
      return response.headings;
    }
    return [];
  } catch (err) {
    console.error("Failed to get headings from content script:", err);
    return [];
  }
};
export const HeadingsPanel = ({
  onScrollToElement,
}: {
  onScrollToElement: (xpaths: string[]) => void;
}) => {
  const [levelFilter, setLevelFilter] = useState(7);
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    await Promise.all([
      (async () => {
        const headings = await getHeadings();
        setHeadings(headings);
      })(),
      (async () => {
        const level = await loadLevelFilter();
        setLevelFilter(level);
      })(),
    ]);
    setLoading(false);
  };

  const loadedRef = useRef(false);
  if (!loadedRef.current) {
    loadedRef.current = true;
    load();
  }

  return (
    <HeadingsList
      onScrollToElement={onScrollToElement}
      onLevelFilterChange={(level) => {
        setLevelFilter(level);
        saveLevelFlter(level);
      }}
      levelFilter={levelFilter}
      loading={loading}
      headings={headings}
    />
  );
};
