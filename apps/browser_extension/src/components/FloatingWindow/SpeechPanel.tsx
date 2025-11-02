import { use, useCallback } from "react";
import { Speech } from "@/components/Speech";
import { SpeakerContext } from "@/Speech";
import { removeSpeechSettings, saveSpeechSettings } from "@/storage";
import type { SpeechSettings } from "@/types";

export const SpeechPanel = () => {
  const {
    isSpeechEnabled,
    speechSettings,
    updateSpeechSettings,
    enableSpeech,
    disableSpeech,
  } = use(SpeakerContext);
  const onChangeSettings = useCallback(
    async (newSettings: SpeechSettings) => {
      saveSpeechSettings(newSettings);
      updateSpeechSettings(newSettings);
    },
    [updateSpeechSettings],
  );
  const onReset = useCallback(async () => {
    removeSpeechSettings();
    updateSpeechSettings({});
  }, [updateSpeechSettings]);
  return (
    <Speech
      isSpeechEnabled={isSpeechEnabled}
      speechSettings={speechSettings}
      onReset={onReset}
      onChangeSettings={onChangeSettings}
      onEnable={enableSpeech}
      onDisable={disableSpeech}
    />
  );
};
