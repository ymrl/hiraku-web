import { createI18n } from "@wxt-dev/i18n";
import { useId } from "react";
import { browser } from "wxt/browser";
import type { TextStyleSettings as TextStyleSettingsType } from "../../types";

const { t } = createI18n();

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  unit?: string;
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  unit = "",
}: SliderProps) {
  const id = useId();

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <label
          htmlFor={id}
          className="text-sm font-medium text-stone-600 dark:text-stone-300"
        >
          {label}
        </label>
        <span className="text-sm font-bold text-rose-600 dark:text-rose-400 min-w-12 text-right">
          {(value ?? 0).toFixed(step < 0.1 ? 2 : 1)}
          {unit}
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value ?? 0}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-stone-200 dark:bg-stone-600 rounded-lg appearance-none cursor-pointer
                   [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
                   [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-rose-500 [&::-webkit-slider-thumb]:cursor-pointer
                   [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:border-0
                   [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full
                   [&::-moz-range-thumb]:bg-rose-500 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-0"
      />
    </div>
  );
}

type TextStyleSettingsProps = {
  settings: TextStyleSettingsType;
  onSettingsChange: (settings: TextStyleSettingsType) => void;
};

export function TextStyleSettings({
  settings,
  onSettingsChange,
}: TextStyleSettingsProps) {
  // デフォルト値を設定
  const safeSettings = {
    fontSize: settings?.fontSize ?? 1.0,
    lineHeight: settings?.lineHeight ?? 1.5,
    paragraphSpacing: settings?.paragraphSpacing ?? 1.0,
    letterSpacing: settings?.letterSpacing ?? 0.0,
    wordSpacing: settings?.wordSpacing ?? 0.0,
  };
  const handleChange = (key: keyof TextStyleSettingsType, value: number) => {
    onSettingsChange({
      ...settings,
      [key]: value,
    });
  };

  const resetToDefaults = async () => {
    try {
      // ストレージからデフォルト値を取得
      const result = await browser.storage.local.get("defaultTextStyle");
      const defaults = result.defaultTextStyle || {
        fontSize: undefined,
        lineHeight: undefined,
        paragraphSpacing: undefined,
        letterSpacing: undefined,
        wordSpacing: undefined,
      };
      onSettingsChange(defaults);
    } catch (err) {
      console.error("Failed to load default settings:", err);
      // エラーが発生した場合はハードコードされたデフォルト値を使用
      onSettingsChange({
        fontSize: undefined,
        lineHeight: undefined,
        paragraphSpacing: undefined,
        letterSpacing: undefined,
        wordSpacing: undefined,
      });
    }
  };

  return (
    <section className="flex flex-col">
      <div className="sticky top-0 left-0 right-0 p-3 bg-stone-100 dark:bg-stone-800 border-b border-stone-200 dark:border-stone-700">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-stone-800 dark:text-stone-200">
            {t("textStyle.title")}
          </h3>
          <button
            type="button"
            onClick={resetToDefaults}
            className="px-3 py-1 text-xs bg-stone-200 dark:bg-stone-600 text-stone-700 dark:text-stone-300 rounded hover:bg-stone-300 dark:hover:bg-stone-500 border border-stone-400 dark:border-stone-600 transition-colors"
          >
            {t("textStyle.reset")}
          </button>
        </div>
      </div>

      <div className="p-4">
        <Slider
          label={t("textStyle.fontSize")}
          value={safeSettings.fontSize}
          min={0.5}
          max={3.0}
          step={0.1}
          onChange={(value) => handleChange("fontSize", value)}
          unit={t("textStyle.units.times")}
        />

        <Slider
          label={t("textStyle.lineHeight")}
          value={safeSettings.lineHeight}
          min={1.0}
          max={3.0}
          step={0.1}
          onChange={(value) => handleChange("lineHeight", value)}
        />

        <Slider
          label={t("textStyle.paragraphSpacing")}
          value={safeSettings.paragraphSpacing}
          min={1.0}
          max={3.0}
          step={0.1}
          onChange={(value) => handleChange("paragraphSpacing", value)}
          unit={t("textStyle.units.em")}
        />

        <Slider
          label={t("textStyle.letterSpacing")}
          value={safeSettings.letterSpacing}
          min={0.0}
          max={0.5}
          step={0.01}
          onChange={(value) => handleChange("letterSpacing", value)}
          unit={t("textStyle.units.em")}
        />

        <Slider
          label={t("textStyle.wordSpacing")}
          value={safeSettings.wordSpacing}
          min={0.0}
          max={0.5}
          step={0.01}
          onChange={(value) => handleChange("wordSpacing", value)}
          unit={t("textStyle.units.em")}
        />
      </div>
    </section>
  );
}
