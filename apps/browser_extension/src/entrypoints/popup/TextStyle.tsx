import { createI18n } from "@wxt-dev/i18n";
import { useCallback, useEffect, useId, useState } from "react";
import { browser } from "wxt/browser";
import { getCurrentTabId } from "@/browser/getCurrentTabId";
import { Button } from "@/components/Button";
import { SettingSlider } from "@/components/SettingSlider";
import { sendMessageToTab } from "@/ExtensionMessages";
import {
  loadDefaultTextStyleSettings,
  loadHostTextStyle,
  TEXT_STYLE_SETTINGS,
} from "@/TextStyle";
import type { TextStyleSettings } from "../../types";

const { t } = createI18n();

type TextStyleSettingsProps = {
  currentTabHost: string;
};

export function TextStyle({ currentTabHost }: TextStyleSettingsProps) {
  const [pageStyles, setPageStyles] = useState<TextStyleSettings>({});

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

  const sendSettingsToContentScript = async (settings: TextStyleSettings) => {
    const tabId = await getCurrentTabId();
    if (tabId) {
      sendMessageToTab(tabId, {
        action: "updateTextStyle",
        settings: settings,
      });
    }
  };

  const saveSettings = async (settings: TextStyleSettings) => {
    if (currentTabHost) {
      try {
        await browser.storage.local.set({
          [`textStyle_${currentTabHost}`]: settings,
        });

        // コンテンツスクリプトに設定変更を通知
        await sendSettingsToContentScript(settings);
      } catch (err) {
        console.error("Failed to save text style settings:", err);
      }
    }
  };

  const loadPageDefaultSettings = useCallback(async () => {
    try {
      const tabId = await getCurrentTabId();
      if (!tabId) return;
      const { pageTextStyle } = await sendMessageToTab(tabId, {
        action: "getPageTextStyle",
      });
      if (pageTextStyle) {
        setPageStyles(pageTextStyle);
      }
    } catch (err) {
      console.error("Failed to load page default settings:", err);
    }
  }, []);

  const resetToDefaults = async () => {
    // ページの設定を削除
    browser.storage.local.remove(`textStyle_${currentTabHost}`);
    // ストレージからデフォルト値を取得
    const defaults = await loadDefaultTextStyleSettings();
    if (defaults) {
      setSettings(defaults);
      sendSettingsToContentScript(defaults);
      return;
    }
    setSettings(pageStyles);
    sendSettingsToContentScript({});
  };

  useEffect(() => {
    loadPageDefaultSettings();
  }, [loadPageDefaultSettings]);

  useEffect(() => {
    const loadSavedSettings = async () => {
      const settings = await loadHostTextStyle(currentTabHost);
      if (settings) {
        setSettings(settings);
      }
    };
    loadSavedSettings();
  }, [currentTabHost]);
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
          value={settings.fontSize ?? pageStyles.fontSize ?? 1.0}
          {...TEXT_STYLE_SETTINGS.fontSize}
          onChange={(value) => handleChange("fontSize", value)}
          unit={t("units.percent")}
          toDisplay={(v) => Math.round(v * 100)}
          fromDisplay={(v) => v / 100}
        />

        <SettingSlider
          label={t("textStyle.lineHeight")}
          value={settings.lineHeight ?? pageStyles.lineHeight ?? 1.2}
          {...TEXT_STYLE_SETTINGS.lineHeight}
          onChange={(value) => handleChange("lineHeight", value)}
          unit={t("units.percent")}
          toDisplay={(v) => Math.round(v * 100)}
          fromDisplay={(v) => v / 100}
        />

        <SettingSlider
          label={t("textStyle.paragraphSpacing")}
          value={
            settings.paragraphSpacing ?? pageStyles.paragraphSpacing ?? 1.0
          }
          {...TEXT_STYLE_SETTINGS.paragraphSpacing}
          onChange={(value) => handleChange("paragraphSpacing", value)}
          unit={t("units.em")}
        />

        <SettingSlider
          label={t("textStyle.letterSpacing")}
          value={settings.letterSpacing ?? pageStyles.letterSpacing ?? 0.0}
          {...TEXT_STYLE_SETTINGS.letterSpacing}
          onChange={(value) => handleChange("letterSpacing", value)}
          unit={t("units.em")}
        />

        <SettingSlider
          label={t("textStyle.wordSpacing")}
          value={settings.wordSpacing ?? pageStyles.wordSpacing ?? 0.0}
          {...TEXT_STYLE_SETTINGS.wordSpacing}
          onChange={(value) => handleChange("wordSpacing", value)}
          unit={t("units.em")}
        />
      </div>
      <p className="px-4 pb-4 text-xs text-stone-700 dark:text-stone-300">
        {t("textStyle.disclaimer")}
      </p>
    </section>
  );
}
