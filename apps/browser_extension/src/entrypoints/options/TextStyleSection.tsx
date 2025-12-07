import { createI18n } from "@wxt-dev/i18n";
import { type ComponentProps, useMemo, useState } from "react";
import { Button } from "@/components/Button";
import { SettingSlider } from "@/components/SettingSlider";
import {
  removeDefaultTextStyleSettings,
  saveDefaultTextStyleSettings,
} from "@/storage";
import { TEXT_STYLE_SETTINGS } from "@/TextStyle";
import type { TextStyleSettings } from "@/types";
import { TextStylePreviewIFrame } from "./TextStylePreviewIFrame";

const { t } = createI18n();

type TextStyleStatus = "default" | "changed" | "saved" | "loaded";

export const TextStyleSection = ({
  defaultTextStyle,
  onSavedDefaultTextStyle,
  onResetDefaultTextStyle,
}: {
  defaultTextStyle: TextStyleSettings | undefined;
  onSavedDefaultTextStyle?: (settings: TextStyleSettings | undefined) => void;
  onResetDefaultTextStyle?: () => void;
}) => {
  const [textStyle, setTextStyle] = useState<TextStyleSettings>(
    defaultTextStyle || {},
  );
  const [textStyleStatus, setTextStyleStatus] =
    useState<TextStyleStatus>("default");
  const [isSaving, setIsSaving] = useState(false);

  const [resetAt, setResetAt] = useState(0);

  useMemo(() => {
    if (defaultTextStyle === undefined) {
      setTextStyle({});
      setTextStyleStatus("default");
      return;
    }
    setTextStyle(defaultTextStyle);
    setTextStyleStatus("loaded");
  }, [defaultTextStyle]);

  const save = async (newSettings: TextStyleSettings) => {
    setIsSaving(true);
    setTextStyle(newSettings);
    await saveDefaultTextStyleSettings(newSettings);
    onSavedDefaultTextStyle?.(newSettings);
    setIsSaving(false);
  };

  const reset = async () => {
    setIsSaving(true);
    setTextStyle({});
    await removeDefaultTextStyleSettings();
    onResetDefaultTextStyle?.();
    setIsSaving(false);
  };

  const setDefaultValues = () => {
    setResetAt(Date.now());
    setTextStyle((prev) => {
      if (!prev) {
        return prev;
      }
      return Object.fromEntries(
        Object.entries(prev).map(([key]) => [
          key,
          TEXT_STYLE_SETTINGS[key as keyof TextStyleSettings].defaultValue,
        ]),
      );
    });
  };

  const handleChange = (
    key: keyof TextStyleSettings,
    value: number | undefined,
  ) => {
    setTextStyleStatus("changed");
    setResetAt(0);
    setTextStyle((prev) => ({
      ...prev,
      [key]: value,
    }));
  };
  return (
    <section className="@container p-4 bg-white dark:bg-stone-800 rounded-xl border border-stone-300 dark:border-stone-600">
      <h2 className="text-lg font-bold text-stone-800 dark:text-stone-200 mb-3">
        {t("options.textStyleDefaults")}
      </h2>
      <p className="text-base htext-stone-800 dark:text-stone-200 mb-3">
        {t("options.textStyleDefaultsDescription")}
      </p>
      <div className="flex flex-col @2xl:flex-row gap-4 @2xl:gap-6 w-full mb-4">
        <div className="w-full @2xl:w-96">
          <div className="flex flex-col gap-4">
            {/* 文字の大きさ */}
            <TextStyleItem
              itemKey="fontSize"
              textStyle={textStyle}
              status={textStyleStatus}
              resetAt={resetAt}
              toggleLabel={t("options.enableFontSize")}
              label={t("textStyle.fontSize")}
              onValueChange={handleChange}
              unit={t("units.percent")}
              toDisplay={(v) => Math.round(v * 100)}
              fromDisplay={(v) => v / 100}
            />

            {/* 行の高さ */}
            <TextStyleItem
              itemKey="lineHeight"
              textStyle={textStyle}
              status={textStyleStatus}
              resetAt={resetAt}
              toggleLabel={t("options.enableLineHeight")}
              label={t("textStyle.lineHeight")}
              onValueChange={handleChange}
              unit={t("units.percent")}
              toDisplay={(v) => Math.round(v * 100)}
              fromDisplay={(v) => v / 100}
            />

            {/* 段落の間隔 */}
            <TextStyleItem
              itemKey="paragraphSpacing"
              textStyle={textStyle}
              status={textStyleStatus}
              resetAt={resetAt}
              toggleLabel={t("options.enableParagraphSpacing")}
              label={t("textStyle.paragraphSpacing")}
              onValueChange={handleChange}
              unit={t("units.em")}
            />

            {/* 文字の間隔 */}
            <TextStyleItem
              itemKey="letterSpacing"
              textStyle={textStyle}
              status={textStyleStatus}
              resetAt={resetAt}
              toggleLabel={t("options.enableLetterSpacing")}
              label={t("textStyle.letterSpacing")}
              onValueChange={handleChange}
              unit={t("units.em")}
            />

            {/* 単語の間隔 */}
            <TextStyleItem
              itemKey="wordSpacing"
              textStyle={textStyle}
              status={textStyleStatus}
              resetAt={resetAt}
              toggleLabel={t("options.enableWordSpacing")}
              label={t("textStyle.wordSpacing")}
              onValueChange={handleChange}
              unit={t("units.em")}
            />
          </div>
        </div>
        <div className="flex-1 flex flex-col w-full @2xl:max-w-xl">
          {/* <div className="flex flex-col"> */}
          <h3 className="text-sm font-semibold text-stone-800 dark:text-stone-200 mb-2">
            {t("options.preview")}
          </h3>
          <TextStylePreviewIFrame textStyle={textStyle} />
          {/* </div> */}
        </div>
      </div>

      {/* 保存・リセットボタン */}
      <div className="flex flex-wrap items-center gap-2">
        <Button
          appearance="primary"
          onClick={() => save(textStyle)}
          disabled={
            isSaving ||
            textStyleStatus === "default" ||
            textStyleStatus === "saved"
          }
        >
          {t("options.save")}
        </Button>

        <Button
          appearance="secondary"
          onClick={reset}
          disabled={isSaving || textStyleStatus === "default"}
        >
          {t("options.resetToDefaults")}
        </Button>
        <Button
          appearance="tertiary"
          disabled={isSaving}
          onClick={setDefaultValues}
        >
          {t("options.defaultValues")}
        </Button>
      </div>
    </section>
  );
};

const TextStyleItem = ({
  itemKey,
  textStyle,
  toggleLabel,
  label,
  unit,
  status,
  resetAt,
  onValueChange,
  toDisplay,
  fromDisplay,
}: {
  itemKey: keyof TextStyleSettings;
  textStyle: TextStyleSettings;
  toggleLabel: string;
  status: TextStyleStatus;
  label: string;
  resetAt: number;
  onValueChange: (
    key: keyof TextStyleSettings,
    value: number | undefined,
  ) => void;
} & Pick<
  ComponentProps<typeof SettingSlider>,
  "unit" | "toDisplay" | "fromDisplay"
>) => {
  const { min, max, step, defaultValue } = TEXT_STYLE_SETTINGS[itemKey];
  const value = textStyle[itemKey];
  const [slideValue, setSlideValue] = useState<number>(value ?? defaultValue);
  useMemo(() => {
    if (value !== undefined) {
      setSlideValue(value);
      return;
    }
    if (status === "default") {
      setSlideValue(defaultValue);
      return;
    }
    if (resetAt > 0) {
      setSlideValue(defaultValue);
    }
  }, [value, status, defaultValue, resetAt]);
  return (
    <div className="min-w-40">
      <label className="flex items-center gap-2 mb-0.5">
        <input
          type="checkbox"
          checked={value !== undefined}
          onChange={(e) => {
            onValueChange(itemKey, e.target.checked ? slideValue : undefined);
          }}
          className="w-4 h-4"
        />
        <span className="text-sm font-bold text-stone-700 dark:text-stone-300">
          {toggleLabel}
        </span>
      </label>
      <SettingSlider
        min={min}
        max={max}
        step={step}
        label={label}
        value={slideValue}
        onChange={(v) => {
          setSlideValue(v);
          if (value !== undefined) {
            onValueChange(itemKey, v);
          }
        }}
        unit={unit}
        toDisplay={toDisplay}
        fromDisplay={fromDisplay}
        status={value === undefined ? "inactive" : "active"}
      />
    </div>
  );
};
