import { createI18n } from "@wxt-dev/i18n";
import { useCallback, useEffect, useState } from "react";
import { browser } from "wxt/browser";
import { getCurrentTabId } from "@/browser/getCurrentTabId";
import { Button } from "@/components/Button";
import { SettingSlider } from "@/components/SettingSlider";
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
      await browser.tabs.sendMessage(tabId, {
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
      const { pageTextStyle } =
        tabId &&
        (await browser.tabs.sendMessage(tabId, {
          action: "getPageTextStyle",
        }));
      if (pageTextStyle) {
        setPageStyles(pageTextStyle);
      }
    } catch (err) {
      console.error("Failed to load page default settings:", err);
    }
  }, []);

  const loadHostSettings = useCallback(async () => {
    try {
      const result = await browser.storage.local.get(
        `textStyle_${currentTabHost}`,
      );
      const hostSettings = result[`textStyle_${currentTabHost}`];
      if (hostSettings) {
        console.log("Loaded host settings for", currentTabHost, hostSettings);
        return hostSettings;
      }
    } catch (err) {
      console.error("Failed to load host settings:", err);
      return undefined;
    }
  }, [currentTabHost]);

  const loadDefaultSettings = useCallback(async () => {
    try {
      const result = await browser.storage.sync.get("defaultTextStyle");
      const defaults = result.defaultTextStyle;
      console.log("Loaded default text style settings", defaults);
      return defaults;
    } catch (err) {
      console.error("Failed to load default settings:", err);
      return undefined;
    }
  }, []);

  const resetToDefaults = async () => {
    // ページの設定を削除
    browser.storage.local.remove(`textStyle_${currentTabHost}`);
    // ストレージからデフォルト値を取得
    const defaults = await loadDefaultSettings();
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
      try {
        // まずホスト固有の設定を読み込む
        const hostSettings = await loadHostSettings();
        if (hostSettings) {
          console.log(
            "Loaded settings for host:",
            currentTabHost,
            hostSettings,
          );
          setSettings(hostSettings);
          return;
        }
        // ホスト固有の設定がない場合は、デフォルト設定を読み込む
        const defaultSettings = await loadDefaultSettings();
        if (defaultSettings) {
          console.log("Loaded default text style settings", defaultSettings);
          setSettings(defaultSettings);
          return;
        }
      } catch (err) {
        console.error("Failed to load saved settings:", err);
      }
    };
    loadSavedSettings();
  }, [currentTabHost, loadHostSettings, loadDefaultSettings]);

  return (
    <section className="flex flex-col">
      <div className="sticky top-0 left-0 right-0 px-3 py-2 bg-stone-100 dark:bg-stone-800 border-b border-stone-200 dark:border-stone-700">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-stone-800 dark:text-stone-200">
            {t("textStyle.title")}
          </h3>
          <Button appearance="secondary" onClick={resetToDefaults} size="small">
            {t("textStyle.reset")}
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <SettingSlider
          label={t("textStyle.fontSize")}
          value={settings.fontSize ?? pageStyles.fontSize ?? 1.0}
          min={0.5}
          max={3.0}
          step={0.01}
          onChange={(value) => handleChange("fontSize", value)}
          displayValue={(value) =>
            `${Math.round(value * 100)}${t("textStyle.units.percent")}`
          }
        />

        <SettingSlider
          label={t("textStyle.lineHeight")}
          value={settings.lineHeight ?? pageStyles.lineHeight ?? 1.2}
          min={1.0}
          max={3.0}
          step={0.01}
          onChange={(value) => handleChange("lineHeight", value)}
          displayValue={(value) =>
            `${Math.round(value * 100)}${t("textStyle.units.percent")}`
          }
        />

        <SettingSlider
          label={t("textStyle.paragraphSpacing")}
          value={
            settings.paragraphSpacing ?? pageStyles.paragraphSpacing ?? 1.0
          }
          min={1.0}
          max={3.0}
          step={0.1}
          onChange={(value) => handleChange("paragraphSpacing", value)}
          unit={t("textStyle.units.em")}
        />

        <SettingSlider
          label={t("textStyle.letterSpacing")}
          value={settings.letterSpacing ?? pageStyles.letterSpacing ?? 0.0}
          min={0.0}
          max={0.5}
          step={0.01}
          onChange={(value) => handleChange("letterSpacing", value)}
          unit={t("textStyle.units.em")}
        />

        <SettingSlider
          label={t("textStyle.wordSpacing")}
          value={settings.wordSpacing ?? pageStyles.wordSpacing ?? 0.0}
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
