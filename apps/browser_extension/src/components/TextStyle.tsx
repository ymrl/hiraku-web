import { createI18n } from "@wxt-dev/i18n";
import { useId, useMemo, useState } from "react";
import { Button } from "@/components/Button";
import { SettingSlider } from "@/components/SettingSlider";
import { TEXT_STYLE_SETTINGS } from "@/TextStyle";
import type { TextStyleSettings } from "@/types";

const { t } = createI18n();

export function TextStyle({
  currentTextStyle,
  pageDefaultTextStyle = {},
  onChangeTextStyle,
  onResetToDefaults,
}: {
  currentTextStyle: TextStyleSettings | undefined;
  pageDefaultTextStyle?: TextStyleSettings;
  onChangeTextStyle?: (style: TextStyleSettings) => void;
  onResetToDefaults?: () => void;
}) {
  const [unsavedStyle, setUnsavedStyle] = useState<TextStyleSettings>({});

  const handleChange = (key: keyof TextStyleSettings, value: number) => {
    const newStyle = { ...unsavedStyle, [key]: value };
    setUnsavedStyle(newStyle);
    onChangeTextStyle?.({ ...currentTextStyle, ...newStyle });
  };

  const resetToDefaults = async () => {
    setUnsavedStyle({});
    onResetToDefaults?.();
  };

  const localStyle = useMemo(
    () => ({ ...currentTextStyle, ...unsavedStyle }),
    [currentTextStyle, unsavedStyle],
  );

  const id = useId();

  return (
    <section
      className="flex flex-col"
      role="tabpanel"
      aria-labelledby={`${id}-heading`}
    >
      <div className="sticky top-0 left-0 right-0 px-3 py-2 bg-stone-100 dark:bg-stone-800 border-b border-stone-200 dark:border-stone-700">
        <div className="flex items-center justify-between">
          <h2
            className="text-sm font-medium text-stone-800 dark:text-stone-200"
            id={`${id}-heading`}
          >
            {t("textStyle.title")}
          </h2>
          <Button appearance="secondary" onClick={resetToDefaults} size="small">
            {t("textStyle.reset")}
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-4 p-4">
        <SettingSlider
          label={t("textStyle.fontSize")}
          value={localStyle.fontSize ?? pageDefaultTextStyle.fontSize ?? 1.0}
          {...TEXT_STYLE_SETTINGS.fontSize}
          onChange={(value) => handleChange("fontSize", value)}
          unit={t("units.percent")}
          toDisplay={(v) => Math.round(v * 100)}
          fromDisplay={(v) => v / 100}
        />

        <SettingSlider
          label={t("textStyle.lineHeight")}
          value={
            localStyle.lineHeight ?? pageDefaultTextStyle.lineHeight ?? 1.2
          }
          {...TEXT_STYLE_SETTINGS.lineHeight}
          onChange={(value) => handleChange("lineHeight", value)}
          unit={t("units.percent")}
          toDisplay={(v) => Math.round(v * 100)}
          fromDisplay={(v) => v / 100}
        />

        <SettingSlider
          label={t("textStyle.paragraphSpacing")}
          value={
            localStyle.paragraphSpacing ??
            pageDefaultTextStyle.paragraphSpacing ??
            1.0
          }
          {...TEXT_STYLE_SETTINGS.paragraphSpacing}
          onChange={(value) => handleChange("paragraphSpacing", value)}
          unit={t("units.em")}
        />

        <SettingSlider
          label={t("textStyle.letterSpacing")}
          value={
            localStyle.letterSpacing ??
            pageDefaultTextStyle.letterSpacing ??
            0.0
          }
          {...TEXT_STYLE_SETTINGS.letterSpacing}
          onChange={(value) => handleChange("letterSpacing", value)}
          unit={t("units.em")}
        />

        <SettingSlider
          label={t("textStyle.wordSpacing")}
          value={
            localStyle.wordSpacing ?? pageDefaultTextStyle.wordSpacing ?? 0.0
          }
          {...TEXT_STYLE_SETTINGS.wordSpacing}
          onChange={(value) => handleChange("wordSpacing", value)}
          unit={t("units.em")}
        />
      </div>
      <p className="px-4 pb-4 text-xs leading-4 text-stone-700 dark:text-stone-300">
        {t("textStyle.disclaimer")}
      </p>
    </section>
  );
}
