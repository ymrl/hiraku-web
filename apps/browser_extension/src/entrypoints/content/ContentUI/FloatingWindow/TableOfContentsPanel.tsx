import { useEffect, useMemo, useState } from "react";
import { browser } from "wxt/browser";
import { TableOfContentsList } from "@/components/TableOfContentsList";
import type { TableOfContents } from "@/types";
import { getTableOfContents } from "../../collection";

const loadLevelFilter = async (): Promise<number> => {
  try {
    const hostname = window.location.hostname;
    const result = await browser.storage.local.get(`headingLevel_${hostname}`);
    if (result[`headingLevel_${hostname}`]) {
      return result[`headingLevel_${hostname}`];
    }
    return 7;
  } catch (err) {
    console.error("Failed to load heading level filter:", err);
    return 7;
  }
};

const saveLevelFilter = async (levelFilter: number) => {
  try {
    const hostname = window.location.hostname;
    await browser.storage.local.set({
      [`headingLevel_${hostname}`]: levelFilter,
    });
  } catch (err) {
    console.error("Failed to save heading level filter:", err);
  }
};

export const TableOfContentsPanel = ({
  onScrollToElement,
}: {
  onScrollToElement: (xpaths: string[]) => void;
}) => {
  const [levelFilter, setLevelFilter] = useState(7);

  const tableOfContents = useMemo<TableOfContents | null>(() => {
    try {
      return getTableOfContents({ exclude: "[data-hiraku-web-iframe-root]" });
    } catch (err) {
      console.error("Failed to get table of contents:", err);
      return null;
    }
  }, []);

  useEffect(() => {
    const loadSettings = async () => {
      const level = await loadLevelFilter();
      setLevelFilter(level);
    };
    loadSettings();
  }, []);

  return (
    <TableOfContentsList
      onScrollToElement={onScrollToElement}
      onLevelFilterChange={(level) => {
        setLevelFilter(level);
        saveLevelFilter(level);
      }}
      levelFilter={levelFilter}
      loading={false}
      tableOfContents={tableOfContents}
    />
  );
};
