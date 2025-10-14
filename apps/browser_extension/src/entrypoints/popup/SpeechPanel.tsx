import { useCallback, useRef, useState } from "react";
import { getCurrentTabId } from "@/browser/getCurrentTabId";
import { Speech } from "@/components/Speech";
import { sendMessage, sendMessageToTab } from "@/ExtensionMessages";
import {
  loadSpeechSettings,
  removeSpeechSettings,
  saveSpeechSettings,
} from "@/storage/Speech";
import type { SpeechSettings } from "@/types";

const sendSettingToTab = async (newSettings: SpeechSettings) => {
  try {
    const tabId = await getCurrentTabId();
    if (!tabId) throw new Error("No active tab found");
    await sendMessageToTab(tabId, {
      action: "updateSpeechSettings",
      settings: newSettings,
    });
  } catch (err) {
    console.error("Failed to send speech settings to tab:", err);
  }
};

export const SpeechPanel = () => {
  const [speechSettings, setSpeechSettings] = useState<SpeechSettings>({});
  const [isEnabled, setIsEnabled] = useState(false);

  const enableSpeech = useCallback(async () => {
    setIsEnabled(true);
    const tabId = await getCurrentTabId();
    if (!tabId) throw new Error("No active tab found");
    await sendMessageToTab(tabId, {
      action: "enableSpeech",
      settings: speechSettings,
    });
    await sendMessage({ action: "speechEnabled" });
  }, [speechSettings]);

  const disableSpeech = useCallback(async () => {
    setIsEnabled(false);
    const tabId = await getCurrentTabId();
    if (!tabId) throw new Error("No active tab found");
    await sendMessageToTab(tabId, { action: "disableSpeech" });
    await sendMessage({ action: "speechDisabled" });
  }, []);

  const initSpeechSettings = async () => {
    setSpeechSettings((await loadSpeechSettings()) || {});
  };

  const loadEnabled = async () => {
    try {
      const tabId = await getCurrentTabId();
      if (!tabId) throw new Error("No active tab found");
      const { isEnabled } = await sendMessageToTab(tabId, {
        action: "speechStatus",
      });
      setIsEnabled(isEnabled);
    } catch (err) {
      console.error("Failed to send speech status message:", err);
    }
  };

  const resetToDefaults = useCallback(async () => {
    removeSpeechSettings();
    setSpeechSettings({});
    const tabId = await getCurrentTabId();
    if (!tabId) throw new Error("No active tab found");
    await sendMessageToTab(tabId, {
      action: "updateSpeechSettings",
      settings: {},
    });
  }, []);

  const handleSettingChange = useCallback(
    async (newSettings: SpeechSettings) => {
      setSpeechSettings(newSettings);
      saveSpeechSettings(newSettings);
      sendSettingToTab(newSettings);
    },
    [],
  );

  const isLoadedRef = useRef(false);
  if (!isLoadedRef.current) {
    isLoadedRef.current = true;
    initSpeechSettings();
    loadEnabled();
  }

  return (
    <Speech
      speechSettings={speechSettings}
      isSpeechEnabled={isEnabled}
      onReset={resetToDefaults}
      onChangeSettings={handleSettingChange}
      onEnable={enableSpeech}
      onDisable={disableSpeech}
    />
  );
};
