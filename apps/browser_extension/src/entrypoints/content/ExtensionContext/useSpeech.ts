import { useCallback, useEffect, useRef, useState } from "react";
import {
  addListener,
  type DisableSpeech,
  type EnableSpeech,
  type MessageListener,
  removeListener,
  type SpeechStatus,
  sendMessage,
  type UpdateSpeechSettings,
} from "@/ExtensionMessages";
import { loadSpeechSettings } from "@/storage";
import type { SpeechSettings } from "@/types";

export const useSpeech = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [speechSettings, setSpeechSettings] = useState<SpeechSettings>({
    rate: 1,
    pitch: 1,
    volume: 1,
    voice: "",
  });

  const enableSpeech = useCallback(async () => {
    setIsEnabled(true);
    await sendMessage({ action: "speechEnabled" });
  }, []);

  const disableSpeech = useCallback(async () => {
    setIsEnabled(false);
    speechSynthesis.cancel();
    await sendMessage({ action: "speechDisabled" });
  }, []);

  const updateSpeechSettings = useCallback((settings: SpeechSettings) => {
    setSpeechSettings(settings);
  }, []);

  const isLoadedRef = useRef(false);
  if (!isLoadedRef.current) {
    isLoadedRef.current = true;
    (async () => {
      const settings = await loadSpeechSettings();
      setSpeechSettings(settings || {});
    })();
  }

  useEffect(() => {
    document.addEventListener("visibilitychange", disableSpeech);
    return () =>
      document.removeEventListener("visibilitychange", disableSpeech);
  }, [disableSpeech]);

  useEffect(() => {
    const listener: MessageListener<
      SpeechStatus | EnableSpeech | DisableSpeech | UpdateSpeechSettings
    > = (message, _sender, sendResponse) => {
      const { action } = message;
      if (action === "speechStatus") {
        sendResponse({ action, isEnabled });
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
    };
    addListener(listener);
    return () => {
      removeListener(listener);
    };
  }, [disableSpeech, enableSpeech, updateSpeechSettings, isEnabled]);

  return {
    isSpeechEnabled: isEnabled,
    enableSpeech,
    disableSpeech,
    speechSettings,
    updateSpeechSettings,
  };
};
