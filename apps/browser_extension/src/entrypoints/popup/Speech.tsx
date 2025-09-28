import { createI18n } from "@wxt-dev/i18n";
import { useCallback, useEffect, useId, useState } from "react";
import { browser } from "wxt/browser";
import { getCurrentTabId } from "@/browser/getCurrentTabId";
import { Button } from "@/components/Button";
import { SettingSlider } from "@/components/SettingSlider";
import type { SpeechSettings } from "@/types";

const { t } = createI18n();

export function Speech() {
  const [speechSettings, setSpeechSettings] = useState<SpeechSettings>({});
  const [availableVoices, setAvailableVoices] = useState<
    SpeechSynthesisVoice[]
  >([]);
  const [isEnabled, setIsEnabled] = useState(true);
  const voiceSelectId = useId();

  const sendSpeechMessage = useCallback(
    async (
      action: "enableSpeech" | "disableSpeech" | "updateSpeechSettings",
      settings?: SpeechSettings,
    ) => {
      try {
        const tabId = await getCurrentTabId();
        if (!tabId) return;

        await browser.tabs.sendMessage(tabId, {
          action,
          settings,
        });
      } catch (err) {
        console.error("Failed to send speech message:", err);
      }
    },
    [],
  );

  const loadSpeechSettings = useCallback(async () => {
    try {
      const result = await browser.storage.local.get(["speechSettings"]);

      setSpeechSettings(result.speechSettings || {});
    } catch (err) {
      console.error("Failed to load speech settings:", err);
    }
  }, []);

  const saveSpeechSettings = useCallback(
    async (newSettings: SpeechSettings) => {
      try {
        await browser.storage.local.set({
          speechSettings: newSettings,
        });
        await sendSpeechMessage("updateSpeechSettings", newSettings);
      } catch (err) {
        console.error("Failed to save speech settings:", err);
      }
    },
    [sendSpeechMessage],
  );

  const handleSettingChange = useCallback(
    (key: keyof SpeechSettings, value: number | string) => {
      setSpeechSettings((prev) => {
        const newSettings = { ...prev, [key]: value };
        saveSpeechSettings(newSettings);
        return newSettings;
      });
    },
    [saveSpeechSettings],
  );

  useEffect(() => {
    loadSpeechSettings();
  }, [loadSpeechSettings]);

  useEffect(() => {
    const loadVoices = () => {
      const voices = speechSynthesis.getVoices();
      setAvailableVoices(voices);
    };

    loadVoices();
    speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  useEffect(() => {
    if (isEnabled) {
      sendSpeechMessage("enableSpeech", speechSettings);
    } else {
      sendSpeechMessage("disableSpeech");
    }

    return () => {
      sendSpeechMessage("disableSpeech");
    };
  }, [isEnabled, speechSettings, sendSpeechMessage]);

  const resetToDefaults = useCallback(async () => {
    try {
      await browser.storage.local.remove("speechSettings");
      setSpeechSettings({});
      await sendSpeechMessage("updateSpeechSettings", {});
    } catch (err) {
      console.error("Failed to reset speech settings:", err);
    }
  }, [sendSpeechMessage]);
  const id = useId();

  return (
    <section
      role="tabpanel"
      aria-labelledby={`${id}-heading`}
      className="flex flex-col"
    >
      <h2 className="sr-only" id={`${id}-heading`}>
        {t("speeches")}
      </h2>
      <div className="px-3 py-3 bg-stone-100 dark:bg-stone-800 border-b border-stone-200 dark:border-stone-700">
        <label className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsEnabled((prev) => !prev)}
            className={
              "w-11 h-6 rounded-full relative " +
              "before:content-[''] before:absolute before:rounded-full before:h-5 before:w-5 before:transition-all " +
              (isEnabled
                ? "bg-rose-600 hover:not-disabled:bg-rose-600 "
                : "bg-stone-600 hover:bg-stone-600 ") +
              "before:left-[2px] before:top-[2px] " +
              "before:bg-stone-100 hover:before:bg-white " +
              (isEnabled ? "before:translate-x-full before:border-white" : "")
            }
            aria-pressed={isEnabled}
          >
            <span className="sr-only">{t("speech.enableSpeech")}</span>
          </button>
          <span className="text-sm font-medium text-stone-700 dark:text-stone-100">
            {isEnabled
              ? t("speech.speechModeEnabled")
              : t("speech.speechModeDisabled")}
          </span>
        </label>
      </div>

      <div className="flex flex-col gap-4 p-4">
        <SettingSlider
          label={t("speech.speed")}
          value={speechSettings.rate || 1}
          min={0.1}
          max={3}
          step={0.1}
          onChange={(value) => handleSettingChange("rate", value)}
          displayValue={(value) =>
            `${Math.round(value * 100)}${t("units.percent")}`
          }
        />

        <SettingSlider
          label={t("speech.pitch")}
          value={speechSettings.pitch || 1}
          min={0}
          max={2}
          step={0.1}
          onChange={(value) => handleSettingChange("pitch", value)}
          displayValue={(value) => value.toFixed(1)}
        />

        <SettingSlider
          label={t("speech.volume")}
          value={speechSettings.volume || 1}
          min={0}
          max={1}
          step={0.1}
          onChange={(value) => handleSettingChange("volume", value)}
          displayValue={(value) =>
            `${Math.round(value * 100)}${t("units.percent")}`
          }
        />

        <div className="flex gap-2 items-center justify-between">
          <label
            htmlFor={voiceSelectId}
            className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2"
          >
            {t("speech.voice")}
          </label>
          <select
            id={voiceSelectId}
            value={speechSettings.voice || ""}
            onChange={(e) => handleSettingChange("voice", e.target.value)}
            className="w-52 px-3 py-2 text-sm border border-stone-300 rounded-md bg-white dark:bg-stone-700 dark:border-stone-600 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
          >
            <option value="">{t("speech.default")}</option>
            {availableVoices.map((voice) => (
              <option key={voice.name} value={voice.name}>
                {voice.name} ({voice.lang})
              </option>
            ))}
          </select>
        </div>

        <div className="text-right">
          <Button appearance="secondary" onClick={resetToDefaults} size="small">
            {t("speech.resetToDefaults")}
          </Button>
        </div>
      </div>
    </section>
  );
}
