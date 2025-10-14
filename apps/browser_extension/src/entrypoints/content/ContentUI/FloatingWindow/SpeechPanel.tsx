import { use, useCallback } from "react";
import { Speech } from "@/components/Speech";
import { removeSpeechSettings, saveSpeechSettings } from "@/storage";
import type { SpeechSettings } from "@/types";
import { ExtensionContext } from "../../ExtensionContext";

export const SpeechPanel = () => {
  const {
    isSpeechEnabled,
    speechSettings,
    updateSpeechSettings,
    enableSpeech,
    disableSpeech,
  } = use(ExtensionContext);
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
