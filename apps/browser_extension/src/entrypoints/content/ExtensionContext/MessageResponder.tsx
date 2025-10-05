import { type ReactNode, useCallback, useEffect } from "react";
import { browser } from "wxt/browser";
import type { ExtensionMessage, MessageListener } from "@/ExtensionMessages";
import { getHeadings, getLandmarks } from "../collection";
import { ExtensionContext } from "./ExtensionContext";
import { useSpeech } from "./useSpeech";
import { useTextStyle } from "./useTextStyle";

export const MessageResponder = ({ children }: { children?: ReactNode }) => {
  const {
    currentTextStyle,
    getHostTextStyle,
    pageDefaultTextStyleRef,
    updateCurrentTextStyle,
  } = useTextStyle();

  const {
    isSpeechEnabled,
    enableSpeech,
    disableSpeech,
    speechSettings,
    updateSpeechSettings,
  } = useSpeech();

  const respondMessage: MessageListener<ExtensionMessage> = useCallback(
    (message, _sender, sendResponse) => {
      const { action } = message;
      if (action === "updateTextStyle") {
        const { settings } = message;
        updateCurrentTextStyle(settings);
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
      if (action === "speechStatus") {
        sendResponse({ action, isEnabled: isSpeechEnabled });
        return true;
      }
      if (action === "enableSpeech") {
        enableSpeech();
        if (message.settings) {
          updateSpeechSettings(message.settings);
        }
      }
      if (message.action === "disableSpeech") {
        disableSpeech();
      }
      if (message.action === "updateSpeechSettings") {
        if (message.settings) {
          updateSpeechSettings(message.settings);
        }
      }
    },
    [
      updateCurrentTextStyle,
      pageDefaultTextStyleRef,
      enableSpeech,
      isSpeechEnabled,
      disableSpeech,
      updateSpeechSettings,
    ],
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
        isSpeechEnabled,
        speechSettings,
      }}
    >
      {children}
    </ExtensionContext>
  );
};
