import {
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { browser } from "wxt/browser";
import {
  type ExtensionMessage,
  type MessageListener,
  sendMessage,
} from "@/ExtensionMessages";
import type { TextStyleSettings } from "@/types";
import { getHeadings, getLandmarks } from "../collection";
import { ExtensionContext } from "./ExtensionContext";

export const MessageResponder = ({ children }: { children?: ReactNode }) => {
  const [currentTextStyle, setCurrentTextStyle] = useState<
    TextStyleSettings | undefined
  >({});
  const pageDefaultTextStyleRef = useRef<TextStyleSettings | undefined>(
    undefined,
  );

  const getHostTextStyle = useCallback(async (hostname: string) => {
    const { settings } = await sendMessage({
      action: "getHostTextStyleSettings",
      hostname: hostname,
    });
    setCurrentTextStyle(settings);
  }, []);

  const applyPageDefaultTextStyle = useCallback(
    (textStyle: TextStyleSettings) => {
      pageDefaultTextStyleRef.current = textStyle;
    },
    [],
  );

  const respondMessage: MessageListener<ExtensionMessage> = useCallback(
    (message, _sender, sendResponse) => {
      const { action } = message;
      if (action === "updateTextStyle") {
        const { settings } = message;
        setCurrentTextStyle(settings);
        sendResponse({ action, success: true });
        return true;
      }
      if (action === "getPageTextStyle") {
        sendResponse({
          action,
          pageTextStyle: pageDefaultTextStyleRef.current || {},
        });
        return true;
      }
      if (action === "getHeadings") {
        const headings = getHeadings();
        sendResponse({ action, headings });
        return true;
      }
      if (action === "getLandmarks") {
        const landmarks = getLandmarks();
        sendResponse({ action, landmarks });
        return true;
      }
    },
    [],
  );

  useEffect(() => {
    browser.runtime.onMessage.addListener(respondMessage);
    return () => {
      browser.runtime.onMessage.removeListener(respondMessage);
    };
  }, [respondMessage]);

  return (
    <ExtensionContext
      value={{
        currentTextStyle,
        getHostTextStyle,
        applyPageDefaultTextStyle,
      }}
    >
      {children}
    </ExtensionContext>
  );
};
