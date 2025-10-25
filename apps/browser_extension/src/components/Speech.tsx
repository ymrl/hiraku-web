import { createI18n } from "@wxt-dev/i18n";
import { useCallback, useEffect, useId, useMemo, useState } from "react";
import { Button } from "@/components/Button";
import { SettingSlider } from "@/components/SettingSlider";
import { SPEECH_SETTINGS } from "@/Speech";
import type { SpeechSettings } from "@/types";
import { Switch } from "./Switch";

const { t } = createI18n();

export function Speech({
  isSpeechEnabled = false,
  speechSettings: savedSettings = {},
  onChangeSettings,
  onReset,
  onEnable,
  onDisable,
}: {
  isSpeechEnabled?: boolean;
  speechSettings?: SpeechSettings;
  onChangeSettings?: (settings: SpeechSettings) => void;
  onReset?: () => void;
  onEnable?: () => void;
  onDisable?: () => void;
}) {
  const [unsavedSettings, setUnsavedSettings] =
    useState<SpeechSettings>(savedSettings);
  const speechSettings = useMemo(
    () => ({ ...savedSettings, ...unsavedSettings }),
    [savedSettings, unsavedSettings],
  );

  const [availableVoices, setAvailableVoices] = useState<
    SpeechSynthesisVoice[]
  >([]);
  const voiceSelectId = useId();

  const handleSettingChange = (
    key: keyof SpeechSettings,
    value: number | string,
  ) => {
    const newSettings = { ...savedSettings, ...unsavedSettings, [key]: value };
    onChangeSettings?.(newSettings);
    setUnsavedSettings(newSettings);
  };

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

  const resetToDefaults = useCallback(async () => {
    setUnsavedSettings({});
    onReset?.();
  }, [onReset]);

  const id = useId();
  const isEnabled = isSpeechEnabled;

  return (
    <section
      role="tabpanel"
      aria-labelledby={`${id}-heading`}
      className="flex flex-col"
    >
      <h2 className="sr-only" id={`${id}-heading`}>
        {t("speeches")}
      </h2>
      {/** biome-ignore lint/a11y/noStaticElementInteractions: only to support click the button */}
      {/** biome-ignore lint/a11y/useKeyWithClickEvents: only to support click the button */}
      <div
        className="px-3 py-3 bg-stone-100 dark:bg-stone-800 border-b border-stone-200 dark:border-stone-700"
        onClick={(e) => {
          if ("tagName" in e.target && e.target.tagName === "BUTTON") {
            return;
          }
          const event = new MouseEvent("click", {
            bubbles: true,
            cancelable: true,
          });
          const switchElement = e.currentTarget.querySelector("button");
          switchElement?.dispatchEvent(event);
        }}
      >
        <div className="flex items-center gap-2">
          <Switch
            isOn={isEnabled}
            onToggle={(enabled) => (enabled ? onEnable?.() : onDisable?.())}
          >
            {t("speech.enableSpeech")}
          </Switch>
          <span className="text-sm font-medium text-stone-700 dark:text-stone-100">
            {isEnabled
              ? t("speech.speechModeEnabled")
              : t("speech.speechModeDisabled")}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-4 p-4">
        <SettingSlider
          label={t("speech.speed")}
          value={speechSettings.rate || 1}
          {...SPEECH_SETTINGS.rate}
          onChange={(value) => handleSettingChange("rate", value)}
          unit={t("units.percent")}
          toDisplay={(v) => Math.round(v * 100)}
          fromDisplay={(v) => v / 100}
        />

        <SettingSlider
          label={t("speech.pitch")}
          value={speechSettings.pitch || 1}
          {...SPEECH_SETTINGS.pitch}
          onChange={(value) => handleSettingChange("pitch", value)}
        />

        <SettingSlider
          label={t("speech.volume")}
          value={speechSettings.volume || 1}
          {...SPEECH_SETTINGS.volume}
          onChange={(value) => handleSettingChange("volume", value)}
          unit={t("units.percent")}
          toDisplay={(v) => Math.round(v * 100)}
          fromDisplay={(v) => v / 100}
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

        <div className="flex items-center justify-between gap-1">
          <p className="text-xs leading-4 text-stone-700 dark:text-stone-300">
            {t("speech.disclaimer")}
          </p>
          <div className="shrink-0">
            <Button
              appearance="secondary"
              onClick={resetToDefaults}
              size="small"
            >
              {t("speech.resetToDefaults")}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
