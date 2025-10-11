import { useCallback, useRef, useState } from "react";
import { browser } from "wxt/browser";
import { getCurrentTabId } from "@/browser/getCurrentTabId";
import { Speech } from "@/components/Speech";
import { sendMessage, sendMessageToTab } from "@/ExtensionMessages";
import type { SpeechSettings } from "@/types";

const saveSpeechSettings = async (newSettings: SpeechSettings) => {
  try {
    await browser.storage.local.set({
      speechSettings: newSettings,
    });
  } catch (err) {
    console.error("Failed to save speech settings:", err);
  }
};

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

  const loadSpeechSettings = async () => {
    try {
      const result = await browser.storage.local.get(["speechSettings"]);

      setSpeechSettings(result.speechSettings || {});
    } catch (err) {
      console.error("Failed to load speech settings:", err);
    }
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
    await browser.storage.local.remove("speechSettings");
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
    loadSpeechSettings();
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
