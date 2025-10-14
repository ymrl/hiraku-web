import { useRef, useState } from "react";
import { browser } from "wxt/browser";
import { getCurrentTabId } from "@/browser/getCurrentTabId";
import { TableOfContentsList } from "@/components/TableOfContentsList";
import { type GetTableOfContents, sendMessageToTab } from "@/ExtensionMessages";
import type { TableOfContents } from "@/types";

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

const saveLevelFilter = async (levelFilter: number) => {
  try {
    browser.storage.local.set({
      headingLevel: levelFilter,
    });
  } catch (err) {
    console.error("Failed to save heading level filter:", err);
  }
};

const getTableOfContents = async (): Promise<TableOfContents | null> => {
  try {
    const tabId = await getCurrentTabId();
    if (!tabId) {
      return null;
    }
    const response = await sendMessageToTab<GetTableOfContents>(tabId, {
      action: "getTableOfContents",
    });
    if (response?.tableOfContents) {
      return response.tableOfContents;
    }
    return null;
  } catch (err) {
    console.error("Failed to get table of contents from content script:", err);
    return null;
  }
};

export const TableOfContentsPanel = ({
  onScrollToElement,
}: {
  onScrollToElement: (xpaths: string[]) => void;
}) => {
  const [levelFilter, setLevelFilter] = useState(7);
  const [tableOfContents, setTableOfContents] =
    useState<TableOfContents | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    await Promise.all([
      (async () => {
        const toc = await getTableOfContents();
        setTableOfContents(toc);
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
    <TableOfContentsList
      onScrollToElement={onScrollToElement}
      onLevelFilterChange={(level) => {
        setLevelFilter(level);
        saveLevelFilter(level);
      }}
      levelFilter={levelFilter}
      loading={loading}
      tableOfContents={tableOfContents}
    />
  );
};
