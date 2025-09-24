import { createI18n } from "@wxt-dev/i18n";
import { useCallback, useEffect, useId, useState } from "react";
import { browser } from "wxt/browser";
import type { TextStyleSettings } from "../../types/text";

const { t } = createI18n();

function App() {
  const [isClearing, setIsClearing] = useState(false);
  const [savedKeys, setSavedKeys] = useState<string[]>([]);
  const [defaultTextStyle, setDefaultTextStyle] = useState<TextStyleSettings>({
    fontSize: 1.0,
    lineHeight: 1.5,
    paragraphSpacing: 1.0,
    letterSpacing: 0.0,
    wordSpacing: 0.0,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  const loadSavedKeys = useCallback(async () => {
    setSavedKeys(await browser.storage.local.getKeys());
  }, []);

  const loadDefaultSettings = useCallback(async () => {
    try {
      const result = await browser.storage.local.get("defaultTextStyle");
      if (result.defaultTextStyle) {
        setDefaultTextStyle(result.defaultTextStyle);
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
      setSaveStatus(null);
      await browser.storage.local.set({ defaultTextStyle: defaultTextStyle });
      setSaveStatus(t("options.saved"));
      setTimeout(() => setSaveStatus(null), 2000);
    } catch (err) {
      console.error("Failed to save default settings:", err);
    } finally {
      setIsSaving(false);
    }
  }, [defaultTextStyle]);

  const clearAllSettings = useCallback(async () => {
    try {
      setIsClearing(true);
      // すべての設定を削除（デフォルト設定は除く）
      const result = await browser.storage.local.get("defaultTextStyle");
      await browser.storage.local.clear();
      // デフォルト設定は復元
      if (result.defaultTextStyle) {
        await browser.storage.local.set({
          defaultTextStyle: result.defaultTextStyle,
        });
      }
      await loadSavedKeys();
    } catch (err) {
      console.error("Failed to clear settings:", err);
    } finally {
      setIsClearing(false);
    }
  }, [loadSavedKeys]);

  const id = useId();

  return (
    <div className="min-h-screen bg-white dark:bg-stone-900 p-8">
      <div className="max-w-2xl mx-auto space-y-12">
        {/* テキストスタイルのデフォルト値設定 */}
        <section>
          <h2 className="text-xl font-semibold text-stone-800 dark:text-stone-200 mb-4">
            {t("options.textStyleDefaults")}
          </h2>

          <p className="text-stone-700 dark:text-stone-300 mb-6">
            {t("options.textStyleDefaultsDescription")}
          </p>

          <div className="space-y-6 bg-stone-50 dark:bg-stone-800 p-6 rounded-lg">
            {/* 文字の大きさ */}
            <div>
              <label
                htmlFor={`${id}-fontSize`}
                className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2"
              >
                {t("textStyle.fontSize")}
              </label>
              <div className="flex items-center space-x-4">
                <input
                  id={`${id}-fontSize`}
                  type="range"
                  min="0.5"
                  max="3.0"
                  step="0.1"
                  value={defaultTextStyle.fontSize ?? 1.0}
                  onChange={(e) =>
                    setDefaultTextStyle((prev) => ({
                      ...prev,
                      fontSize: Number(e.target.value),
                    }))
                  }
                  className="flex-1 h-2 bg-stone-200 dark:bg-stone-600 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-sm font-bold text-rose-600 dark:text-rose-400 min-w-16 text-right">
                  {defaultTextStyle.fontSize?.toFixed(1) ?? 1.0}
                  {t("textStyle.units.times")}
                </span>
              </div>
            </div>

            {/* 行の高さ */}
            <div>
              <label
                htmlFor={`${id}-lineHeight`}
                className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2"
              >
                {t("textStyle.lineHeight")}
              </label>
              <div className="flex items-center space-x-4">
                <input
                  id={`${id}-lineHeight`}
                  type="range"
                  min="1.0"
                  max="3.0"
                  step="0.1"
                  value={defaultTextStyle.lineHeight ?? 1.5}
                  onChange={(e) =>
                    setDefaultTextStyle((prev) => ({
                      ...prev,
                      lineHeight: Number(e.target.value),
                    }))
                  }
                  className="flex-1 h-2 bg-stone-200 dark:bg-stone-600 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-sm font-bold text-rose-600 dark:text-rose-400 min-w-16 text-right">
                  {defaultTextStyle.lineHeight?.toFixed(1) ?? 1.5}
                </span>
              </div>
            </div>

            {/* 段落の間隔 */}
            <div>
              <label
                htmlFor={`${id}-paragraphSpacing`}
                className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2"
              >
                {t("textStyle.paragraphSpacing")}
              </label>
              <div className="flex items-center space-x-4">
                <input
                  id={`${id}-paragraphSpacing`}
                  type="range"
                  min="1.0"
                  max="3.0"
                  step="0.1"
                  value={defaultTextStyle.paragraphSpacing ?? 1.0}
                  onChange={(e) =>
                    setDefaultTextStyle((prev) => ({
                      ...prev,
                      paragraphSpacing: Number(e.target.value),
                    }))
                  }
                  className="flex-1 h-2 bg-stone-200 dark:bg-stone-600 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-sm font-bold text-rose-600 dark:text-rose-400 min-w-16 text-right">
                  {defaultTextStyle.paragraphSpacing?.toFixed(1) ?? 1.0}
                  {t("textStyle.units.em")}
                </span>
              </div>
            </div>

            {/* 文字の間隔 */}
            <div>
              <label
                htmlFor={`${id}-letterSpacing`}
                className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2"
              >
                {t("textStyle.letterSpacing")}
              </label>
              <div className="flex items-center space-x-4">
                <input
                  id={`${id}-letterSpacing`}
                  type="range"
                  min="0.0"
                  max="0.5"
                  step="0.01"
                  value={defaultTextStyle.letterSpacing ?? 0.0}
                  onChange={(e) =>
                    setDefaultTextStyle((prev) => ({
                      ...prev,
                      letterSpacing: Number(e.target.value),
                    }))
                  }
                  className="flex-1 h-2 bg-stone-200 dark:bg-stone-600 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-sm font-bold text-rose-600 dark:text-rose-400 min-w-16 text-right">
                  {defaultTextStyle.letterSpacing?.toFixed(2) ?? 0.0}
                  {t("textStyle.units.em")}
                </span>
              </div>
            </div>

            {/* 単語の間隔 */}
            <div>
              <label
                htmlFor={`${id}-wordSpacing`}
                className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2"
              >
                {t("textStyle.wordSpacing")}
              </label>
              <div className="flex items-center space-x-4">
                <input
                  id={`${id}-wordSpacing`}
                  type="range"
                  min="0.0"
                  max="0.5"
                  step="0.01"
                  value={defaultTextStyle.wordSpacing ?? 0.0}
                  onChange={(e) =>
                    setDefaultTextStyle((prev) => ({
                      ...prev,
                      wordSpacing: Number(e.target.value),
                    }))
                  }
                  className="flex-1 h-2 bg-stone-200 dark:bg-stone-600 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-sm font-bold text-rose-600 dark:text-rose-400 min-w-16 text-right">
                  {defaultTextStyle.wordSpacing?.toFixed(2) ?? 0.0}
                  {t("textStyle.units.em")}
                </span>
              </div>
            </div>

            {/* 保存ボタン */}
            <div className="flex items-center space-x-4 pt-4">
              <button
                type="button"
                onClick={saveDefaultSettings}
                disabled={isSaving}
                className="px-6 py-3 cursor-pointer disabled:cursor-not-allowed
                  bg-rose-600 text-white rounded-lg
                  hover:not-disabled:bg-rose-700 disabled:bg-stone-400
                  dark:bg-rose-600 dark:not-disabled:hover:bg-rose-700
                  transition-colors font-medium"
              >
                {t("options.save")}
              </button>
              {saveStatus && (
                <span className="text-sm text-green-600 dark:text-green-400">
                  {saveStatus}
                </span>
              )}
            </div>
          </div>
        </section>

        {/* 設定のクリア */}
        <section>
          <h2 className="text-xl font-semibold text-stone-800 dark:text-stone-200 mb-4">
            {t("options.clearSettings")}
          </h2>

          <p className="text-stone-700 dark:text-stone-300 mb-6">
            {t("options.clearingDescription")}
          </p>

          {savedKeys.length > 0 ? (
            <button
              type="button"
              onClick={clearAllSettings}
              disabled={isClearing || savedKeys.length === 0}
              className="px-6 py-3 cursor-pointer disabled:cursor-not-allowed
                bg-rose-700 text-white rounded-lg
                hover:not-disabled:bg-rose-800 disabled:bg-stone-400
                dark:bg-rose-700 dark:not-disabled:hover:bg-rose-800
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
      </div>
    </div>
  );
}

export default App;
