import { useRef, useState } from "react";
import { getCurrentTabId } from "@/browser/getCurrentTabId";
import { TableOfContentsList } from "@/components/TableOfContentsList";
import { type GetTableOfContents, sendMessageToTab } from "@/ExtensionMessages";
import type { TableOfContents } from "@/types";

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
  const [tableOfContents, setTableOfContents] =
    useState<TableOfContents | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    await Promise.all([
      (async () => {
        const toc = await getTableOfContents();
        setTableOfContents(toc);
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
      loading={loading}
      tableOfContents={tableOfContents}
    />
  );
};
