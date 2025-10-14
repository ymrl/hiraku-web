import { type ReactNode, useCallback, useEffect } from "react";
import { browser } from "wxt/browser";
import type { ExtensionMessage, MessageListener } from "@/ExtensionMessages";
import { getHeadings, getLandmarks, getTableOfContents } from "../collection";
import { ExtensionContext } from "./ExtensionContext";
import { useNavigation } from "./useNavigation";
import { useSpeech } from "./useSpeech";
import { useTextStyle } from "./useTextStyle";
import { useUserInterfaceSettings } from "./useUserInterfaceSettings";

export const Provider = ({ children }: { children?: ReactNode }) => {
  const { currentTextStyle, pageDefaultTextStyle, updateCurrentTextStyle } =
    useTextStyle();

  const {
    isSpeechEnabled,
    enableSpeech,
    disableSpeech,
    speechSettings,
    updateSpeechSettings,
  } = useSpeech();

  const { xpaths, updateXpaths, navigationTimestamp } = useNavigation();
  const useUserInterfaceSettingsReturn = useUserInterfaceSettings();

  const respondMessage: MessageListener<ExtensionMessage> = useCallback(
    (message, _sender, sendResponse) => {
      const { action } = message;
      if (action === "getHeadings") {
        const headings = getHeadings({
          exclude: "[data-hiraku-web-iframe-root]",
        });
        sendResponse({ action, headings });
        return true;
      }
      if (action === "getLandmarks") {
        const landmarks = getLandmarks({
          exclude: "[data-hiraku-web-iframe-root]",
        });
        sendResponse({ action, landmarks });
        return true;
      }
      if (action === "getTableOfContents") {
        const tableOfContents = getTableOfContents({
          exclude: "[data-hiraku-web-iframe-root]",
        });
        sendResponse({ action, tableOfContents });
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
        updateCurrentTextStyle,
        pageDefaultTextStyle,
        isSpeechEnabled,
        speechSettings,
        updateSpeechSettings,
        enableSpeech,
        disableSpeech,
        xpaths,
        navigationTimestamp,
        updateXpaths,
        ...useUserInterfaceSettingsReturn,
      }}
    >
      {children}
    </ExtensionContext>
  );
};
