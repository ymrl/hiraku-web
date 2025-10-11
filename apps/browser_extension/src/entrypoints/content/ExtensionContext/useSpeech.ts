import { useCallback, useEffect, useRef, useState } from "react";
import { sendMessage } from "@/ExtensionMessages";
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
      try {
        const result = await sendMessage({
          action: "getSpeechSettings",
        });
        const { settings } = result;
        setSpeechSettings(settings || {});
      } catch (err) {
        console.error("Failed to load speech settings:", err);
      }
    })();
  }

  useEffect(() => {
    document.addEventListener("visibilitychange", disableSpeech);
    return () =>
      document.removeEventListener("visibilitychange", disableSpeech);
  }, [disableSpeech]);

  return {
    isSpeechEnabled: isEnabled,
    enableSpeech,
    disableSpeech,
    speechSettings,
    updateSpeechSettings,
  };
};
