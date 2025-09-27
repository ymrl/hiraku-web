import { createI18n } from "@wxt-dev/i18n";
import { useCallback, useEffect, useState } from "react";
import { browser } from "wxt/browser";
import { SettingSlider } from "@/components/SettingSlider";
import { TextCSS } from "@/components/TextCSS";
import type { TextStyleSettings } from "../../types/text";

const { t } = createI18n();

function App() {
  const [isClearing, setIsClearing] = useState(false);
  const [savedKeys, setSavedKeys] = useState<string[]>([]);
  const [defaultTextStyle, setDefaultTextStyle] = useState<TextStyleSettings>(
    {},
  );
  const [savedTextStyle, setSavedTextStyle] = useState<TextStyleSettings>({});
  const [isSaving, setIsSaving] = useState(false);
  const [textStyleStatus, setTextStyleStatus] = useState<
    "default" | "changed" | "saved" | "loaded"
  >("default");

  const loadSavedKeys = useCallback(async () => {
    setSavedKeys(await browser.storage.local.getKeys());
  }, []);

  const loadDefaultSettings = useCallback(async () => {
    try {
      const result = await browser.storage.sync.get("defaultTextStyle");
      if (result.defaultTextStyle) {
        setTextStyleStatus("loaded");
        setDefaultTextStyle(result.defaultTextStyle);
        setSavedTextStyle(result.defaultTextStyle);
      }
    } catch (err) {
      console.error("Failed to load default settings:", err);
    }
  }, []);

  useEffect(() => {
    loadSavedKeys();
    loadDefaultSettings();
  }, [loadSavedKeys, loadDefaultSettings]);

  const saveDefaultSettings = useCallback(async () => {
    try {
      setIsSaving(true);
      await browser.storage.sync.set({ defaultTextStyle: defaultTextStyle });
    } catch (err) {
      console.error("Failed to save default settings:", err);
    } finally {
      setIsSaving(false);
      setTextStyleStatus("saved");
      setSavedTextStyle(defaultTextStyle);
    }
  }, [defaultTextStyle]);

  const resetToDefaults = useCallback(async () => {
    try {
      setIsSaving(true);
      await browser.storage.sync.remove("defaultTextStyle");
    } catch (err) {
      console.error("Failed to reset to defaults:", err);
    } finally {
      setIsSaving(false);
      setTextStyleStatus("default");
      setDefaultTextStyle({});
      setSavedTextStyle({});
    }
  }, []);

  const clearAllSettings = useCallback(async () => {
    try {
      setIsClearing(true);
      await browser.storage.local.clear();
      await loadSavedKeys();
    } catch (err) {
      console.error("Failed to clear settings:", err);
    } finally {
      setIsClearing(false);
    }
  }, [loadSavedKeys]);

  return (
    <div className="bg-white dark:bg-stone-900 px-4 space-y-4">
      {/* テキストスタイルのデフォルト値設定 */}
      <section className="mb-6">
        <h2 className="text-lg font-bold text-stone-800 dark:text-stone-200 mb-2">
          {t("options.textStyleDefaults")}
        </h2>
        <p className="text-sm text-stone-700 dark:text-stone-300 mb-4">
          {t("options.textStyleDefaultsDescription")}
        </p>
        <div className="space-y-4">
          {/* 文字の大きさ */}
          <SettingSlider
            min={0.5}
            max={3.0}
            step={0.01}
            label={t("textStyle.fontSize")}
            value={defaultTextStyle.fontSize ?? 1.0}
            displayValue={(value) =>
              `${Math.round(value * 100)}${t("textStyle.units.percent")}`
            }
            onChange={(value) => {
              setTextStyleStatus("changed");
              setDefaultTextStyle((prev) => ({
                ...prev,
                fontSize: value,
              }));
            }}
          />

          {/* 行の高さ */}
          <SettingSlider
            min={1.0}
            max={3.0}
            step={0.01}
            label={t("textStyle.lineHeight")}
            value={defaultTextStyle.lineHeight ?? 1.5}
            displayValue={(value) =>
              `${Math.round(value * 100)}${t("textStyle.units.percent")}`
            }
            onChange={(value) => {
              setTextStyleStatus("changed");
              setDefaultTextStyle((prev) => ({
                ...prev,
                lineHeight: value,
              }));
            }}
          />

          {/* 段落の間隔 */}
          <SettingSlider
            min={1.0}
            max={3.0}
            step={0.1}
            label={t("textStyle.paragraphSpacing")}
            value={defaultTextStyle.paragraphSpacing ?? 1.0}
            unit={t("textStyle.units.em")}
            onChange={(value) => {
              setTextStyleStatus("changed");
              setDefaultTextStyle((prev) => ({
                ...prev,
                paragraphSpacing: value,
              }));
            }}
          />

          {/* 文字の間隔 */}
          <SettingSlider
            min={0.0}
            max={0.5}
            step={0.01}
            label={t("textStyle.letterSpacing")}
            value={defaultTextStyle.letterSpacing ?? 0.0}
            unit={t("textStyle.units.em")}
            onChange={(value) => {
              setTextStyleStatus("changed");
              setDefaultTextStyle((prev) => ({
                ...prev,
                letterSpacing: value,
              }));
            }}
          />

          {/* 単語の間隔 */}
          <SettingSlider
            min={0.0}
            max={0.5}
            step={0.01}
            label={t("textStyle.wordSpacing")}
            value={defaultTextStyle.wordSpacing ?? 0.0}
            unit={t("textStyle.units.em")}
            onChange={(value) => {
              setTextStyleStatus("changed");
              setDefaultTextStyle((prev) => ({
                ...prev,
                wordSpacing: value,
              }));
            }}
          />

          {/* 保存・リセットボタン */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={saveDefaultSettings}
              disabled={
                isSaving ||
                textStyleStatus === "default" ||
                textStyleStatus === "saved"
              }
              className="px-4 py-2 text-sm cursor-pointer
                  bg-rose-600 text-white rounded-lg
                  hover:not-disabled:bg-rose-700 disabled:bg-stone-400
                  dark:bg-rose-600 dark:not-disabled:hover:bg-rose-700
                  dark:disabled:bg-stone-600
                  dark:disabled:text-stone-400
                  transition-colors font-medium"
            >
              {t("options.save")}
            </button>
            <button
              type="button"
              onClick={resetToDefaults}
              disabled={isSaving || textStyleStatus === "default"}
              className="px-4 py-2 text-sm
                  bg-stone-300  text-stone-700 rounded-lg
                  hover:not-disabled:bg-stone-200 disabled:bg-stone-200 disabled:text-stone-500
                  dark:bg-stone-600 dark:border-stone-400 dark:text-white dark:not-disabled:hover:bg-stone-700
                  dark:disabled:bg-stone-700 dark:disabled:text-stone-400
                  transition-colors font-medium"
            >
              {t("options.resetToDefaults")}
            </button>
          </div>
        </div>
      </section>

      {/* 設定のクリア */}
      <section>
        <h2 className="text-lg font-bold text-stone-800 dark:text-stone-200 mb-2">
          {t("options.clearSettings")}
        </h2>
        <p className="text-sm text-stone-700 dark:text-stone-300 mb-4">
          {t("options.clearingDescription")}
        </p>

        {savedKeys.length > 0 ? (
          <button
            type="button"
            onClick={clearAllSettings}
            disabled={isClearing}
            className="px-4 py-2 text-sm
                  bg-rose-600 text-white rounded-lg
                  hover:not-disabled:bg-rose-700 disabled:bg-stone-400
                  dark:bg-rose-600 dark:not-disabled:hover:bg-rose-700
                  transition-colors font-medium"
          >
            {t("options.clearSettings")}
          </button>
        ) : (
          <p className="text-stone-700 dark:text-stone-300">
            {t("options.noSettings")}
          </p>
        )}
      </section>
      <TextCSS settings={savedTextStyle} />
    </div>
  );
}

export default App;
