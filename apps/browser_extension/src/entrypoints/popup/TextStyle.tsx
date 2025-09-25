import { createI18n } from "@wxt-dev/i18n";
import { useCallback, useEffect, useId, useState } from "react";
import { browser } from "wxt/browser";
import { getCurrentTabId } from "@/browser/getCurrentTabId";
import { Slider } from "@/components/Slider";
import type { TextStyleSettings } from "../../types";

const { t } = createI18n();

interface ValueSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  unit?: string;
  displayValue?: (value: number) => string;
}

function ValueSlider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  unit = "",
  displayValue,
}: ValueSliderProps) {
  const id = useId();
  const displayText = displayValue
    ? displayValue(value ?? 0)
    : `${(value ?? 0).toFixed(step < 0.1 ? 2 : 1)}${unit}`;

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
          {displayText}
        </span>
      </div>
      <Slider
        id={id}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}

type TextStyleSettingsProps = {
  currentTabHost: string;
};

export function TextStyle({ currentTabHost }: TextStyleSettingsProps) {
  // デフォルト値を設定
  const [pageDefaultSettings, setPageDefaultSettings] =
    useState<TextStyleSettings>({});
  const [settings, setSettings] = useState<TextStyleSettings>({});

  const handleChange = (key: keyof TextStyleSettings, value: number) => {
    setSettings((prev) => {
      const newSettings = {
        ...prev,
        [key]: value,
      };
      saveSettings(newSettings);
      return newSettings;
    });
  };

  const saveSettings = async (settings: TextStyleSettings) => {
    if (currentTabHost) {
      try {
        await browser.storage.local.set({
          [`textStyle_${currentTabHost}`]: settings,
        });

        // コンテンツスクリプトに設定変更を通知
        const tabId = await getCurrentTabId();
        if (tabId) {
          await browser.tabs.sendMessage(tabId, {
            action: "updateTextStyle",
            settings: settings,
          });
        }
      } catch (err) {
        console.error("Failed to save text style settings:", err);
      }
    }
  };

  const loadPageDefaultSettings = useCallback(async () => {
    try {
      const tabId = await getCurrentTabId();
      const { defaultSettings } =
        tabId &&
        (await browser.tabs.sendMessage(tabId, {
          action: "getDefaultTextStyle",
        }));
      if (defaultSettings) {
        console.log("Loaded page default settings:", defaultSettings);
        setPageDefaultSettings(defaultSettings);
      }
    } catch (err) {
      console.error("Failed to load page default settings:", err);
    }
  }, []);

  const resetToDefaults = async () => {
    try {
      // ストレージからデフォルト値を取得
      const result = await browser.storage.local.get("defaultTextStyle");
      const defaults = result.defaultTextStyle || {};
      setSettings(defaults);
      saveSettings(defaults);
    } catch (err) {
      console.error("Failed to load default settings:", err);
      // エラーが発生した場合はハードコードされたデフォルト値を使用
      setSettings({});
      saveSettings({});
    }
  };
  useEffect(() => {
    loadPageDefaultSettings();
  }, [loadPageDefaultSettings]);

  useEffect(() => {
    const loadSavedSettings = async () => {
      try {
        const result = await browser.storage.local.get([
          `textStyle_${currentTabHost}`,
        ]);
        if (result[`textStyle_${currentTabHost}`]) {
          setSettings(result[`textStyle_${currentTabHost}`]);
        } else {
          // ホスト固有の設定がない場合は、デフォルト設定を読み込む
          const defaultResult =
            await browser.storage.local.get("defaultTextStyle");
          if (defaultResult.defaultTextStyle) {
            setSettings(defaultResult.defaultTextStyle);
          }
        }
      } catch (err) {
        console.error("Failed to load saved settings:", err);
      }
    };
    loadSavedSettings();
  }, [currentTabHost]);

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
        <ValueSlider
          label={t("textStyle.fontSize")}
          value={settings.fontSize ?? pageDefaultSettings.fontSize ?? 1.0}
          min={0.5}
          max={3.0}
          step={0.01}
          onChange={(value) => handleChange("fontSize", value)}
          displayValue={(value) =>
            `${Math.round(value * 100)}${t("textStyle.units.percent")}`
          }
        />

        <ValueSlider
          label={t("textStyle.lineHeight")}
          value={settings.lineHeight ?? pageDefaultSettings.lineHeight ?? 1.2}
          min={1.0}
          max={3.0}
          step={0.01}
          onChange={(value) => handleChange("lineHeight", value)}
          displayValue={(value) =>
            `${Math.round(value * 100)}${t("textStyle.units.percent")}`
          }
        />

        <ValueSlider
          label={t("textStyle.paragraphSpacing")}
          value={
            settings.paragraphSpacing ??
            pageDefaultSettings.paragraphSpacing ??
            1.0
          }
          min={1.0}
          max={3.0}
          step={0.1}
          onChange={(value) => handleChange("paragraphSpacing", value)}
          unit={t("textStyle.units.em")}
        />

        <ValueSlider
          label={t("textStyle.letterSpacing")}
          value={
            settings.letterSpacing ?? pageDefaultSettings.letterSpacing ?? 0.0
          }
          min={0.0}
          max={0.5}
          step={0.01}
          onChange={(value) => handleChange("letterSpacing", value)}
          unit={t("textStyle.units.em")}
        />

        <ValueSlider
          label={t("textStyle.wordSpacing")}
          value={settings.wordSpacing ?? pageDefaultSettings.wordSpacing ?? 0.0}
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
