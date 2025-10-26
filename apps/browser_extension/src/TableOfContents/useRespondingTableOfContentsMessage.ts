import { useEffect } from "react";
import { browser } from "wxt/browser";
import type { ExtensionMessage, MessageListener } from "@/ExtensionMessages";
import { getTableOfContents } from "./getTableOfContents";

export const useRespondingTableOfContentsMessage = ({
  exclude,
}: {
  exclude?: string;
}) => {
  useEffect(() => {
    const respond: MessageListener<ExtensionMessage> = (
      message,
      _sender,
      sendResponse,
    ) => {
      const { action } = message;
      if (action === "getTableOfContents") {
        const tableOfContents = getTableOfContents({ exclude });
        sendResponse({ action, tableOfContents });
        return true;
      }
    };
    browser.runtime.onMessage.addListener(respond);
    return () => {
      browser.runtime.onMessage.removeListener(respond);
    };
  }, [exclude]);
};
