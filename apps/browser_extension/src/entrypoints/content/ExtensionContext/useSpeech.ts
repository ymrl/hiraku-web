import { useCallback, useEffect, useState } from "react";
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
