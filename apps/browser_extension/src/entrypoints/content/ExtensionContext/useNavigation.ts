import { useCallback, useEffect, useState } from "react";
import {
  addListener,
  type MessageListener,
  removeListener,
  type ScrollToElement,
} from "@/ExtensionMessages";

export const useNavigation = () => {
  const [xpaths, setXpaths] = useState<string[]>([]);
  const [navigationTimestamp, setNavigationTimestamp] = useState(0);

  const updateXpaths = useCallback((newXpaths: string[]) => {
    setXpaths(newXpaths);
    setNavigationTimestamp(Date.now());
  }, []);

  useEffect(() => {
    const listener: MessageListener<ScrollToElement> = (
      message,
      _sender,
      sendResponse,
    ) => {
      const { action } = message;
      if (action === "scrollToElement") {
        const { xpaths } = message;
        updateXpaths(xpaths);
        sendResponse({ action, success: true });
        return true;
      }
    };
    addListener(listener);
    return () => {
      removeListener(listener);
    };
  }, [updateXpaths]);

  return { xpaths, updateXpaths, navigationTimestamp };
};
