import { useMemo } from "react";
import { TableOfContentsList } from "@/components/TableOfContentsList";
import { getTableOfContents } from "@/TableOfContents";
import type { TableOfContents } from "@/types";

export const TableOfContentsPanel = ({
  onScrollToElement,
}: {
  onScrollToElement: (xpaths: string[]) => void;
}) => {
  const tableOfContents = useMemo<TableOfContents | null>(() => {
    try {
      return getTableOfContents({ exclude: "[data-hiraku-web-iframe-root]" });
    } catch (err) {
      console.error("Failed to get table of contents:", err);
      return null;
    }
  }, []);

  return (
    <TableOfContentsList
      onScrollToElement={onScrollToElement}
      loading={false}
      tableOfContents={tableOfContents}
    />
  );
};
