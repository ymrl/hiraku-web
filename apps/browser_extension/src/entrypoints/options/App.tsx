import { createI18n } from "@wxt-dev/i18n";
import { useCallback, useEffect, useState } from "react";
import { browser } from "wxt/browser";
import { Button } from "@/components/Button";
import { SettingSlider } from "@/components/SettingSlider";
import { TextCSS } from "@/components/TextCSS";
import { loadDefaultTextStyleSettings } from "@/TextStyle";
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
    const result = await loadDefaultTextStyleSettings();
    if (result) {
      setTextStyleStatus("loaded");
      setDefaultTextStyle(result);
      setSavedTextStyle(result);
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
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={defaultTextStyle.fontSize !== undefined}
                onChange={(e) => {
                  setTextStyleStatus("changed");
                  setDefaultTextStyle((prev) => {
                    if (e.target.checked) {
                      return { ...prev, fontSize: prev.fontSize ?? 1.0 };
                    }
                    // biome-ignore lint/correctness/noUnusedVariables: fontSize is intentionally destructured to remove it
                    const { fontSize, ...rest } = prev;
                    return rest;
                  });
                }}
                className="w-4 h-4"
              />
              <span className="text-sm text-stone-700 dark:text-stone-300">
                {t("options.enableFontSize")}
              </span>
            </label>
            <SettingSlider
              min={0.5}
              max={3.0}
              step={0.01}
              label={t("textStyle.fontSize")}
              value={defaultTextStyle.fontSize ?? 1.0}
              onChange={(value) => {
                setTextStyleStatus("changed");
                setDefaultTextStyle((prev) => ({
                  ...prev,
                  fontSize: value,
                }));
              }}
              disabled={defaultTextStyle.fontSize === undefined}
              unit={t("units.percent")}
              toDisplay={(v) => Math.round(v * 100)}
              fromDisplay={(v) => v / 100}
            />
          </div>

          {/* 行の高さ */}
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={defaultTextStyle.lineHeight !== undefined}
                onChange={(e) => {
                  setTextStyleStatus("changed");
                  setDefaultTextStyle((prev) => {
                    if (e.target.checked) {
                      return { ...prev, lineHeight: prev.lineHeight ?? 1.5 };
                    }
                    // biome-ignore lint/correctness/noUnusedVariables: lineHeight is intentionally destructured to remove it
                    const { lineHeight, ...rest } = prev;
                    return rest;
                  });
                }}
                className="w-4 h-4"
              />
              <span className="text-sm text-stone-700 dark:text-stone-300">
                {t("options.enableLineHeight")}
              </span>
            </label>
            <SettingSlider
              min={1.0}
              max={3.0}
              step={0.01}
              label={t("textStyle.lineHeight")}
              value={defaultTextStyle.lineHeight ?? 1.5}
              onChange={(value) => {
                setTextStyleStatus("changed");
                setDefaultTextStyle((prev) => ({
                  ...prev,
                  lineHeight: value,
                }));
              }}
              disabled={defaultTextStyle.lineHeight === undefined}
              unit={t("units.percent")}
              toDisplay={(v) => Math.round(v * 100)}
              fromDisplay={(v) => v / 100}
            />
          </div>

          {/* 段落の間隔 */}
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={defaultTextStyle.paragraphSpacing !== undefined}
                onChange={(e) => {
                  setTextStyleStatus("changed");
                  setDefaultTextStyle((prev) => {
                    if (e.target.checked) {
                      return {
                        ...prev,
                        paragraphSpacing: prev.paragraphSpacing ?? 1.0,
                      };
                    }
                    // biome-ignore lint/correctness/noUnusedVariables: paragraphSpacing is intentionally destructured to remove it
                    const { paragraphSpacing, ...rest } = prev;
                    return rest;
                  });
                }}
                className="w-4 h-4"
              />
              <span className="text-sm text-stone-700 dark:text-stone-300">
                {t("options.enableParagraphSpacing")}
              </span>
            </label>
            <SettingSlider
              min={1.0}
              max={3.0}
              step={0.1}
              label={t("textStyle.paragraphSpacing")}
              value={defaultTextStyle.paragraphSpacing ?? 1.0}
              onChange={(value) => {
                setTextStyleStatus("changed");
                setDefaultTextStyle((prev) => ({
                  ...prev,
                  paragraphSpacing: value,
                }));
              }}
              disabled={defaultTextStyle.paragraphSpacing === undefined}
              unit={t("units.em")}
            />
          </div>

          {/* 文字の間隔 */}
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={defaultTextStyle.letterSpacing !== undefined}
                onChange={(e) => {
                  setTextStyleStatus("changed");
                  setDefaultTextStyle((prev) => {
                    if (e.target.checked) {
                      return {
                        ...prev,
                        letterSpacing: prev.letterSpacing ?? 0.0,
                      };
                    }
                    // biome-ignore lint/correctness/noUnusedVariables: letterSpacing is intentionally destructured to remove it
                    const { letterSpacing, ...rest } = prev;
                    return rest;
                  });
                }}
                className="w-4 h-4"
              />
              <span className="text-sm text-stone-700 dark:text-stone-300">
                {t("options.enableLetterSpacing")}
              </span>
            </label>
            <SettingSlider
              min={0.0}
              max={0.5}
              step={0.01}
              label={t("textStyle.letterSpacing")}
              value={defaultTextStyle.letterSpacing ?? 0.0}
              onChange={(value) => {
                setTextStyleStatus("changed");
                setDefaultTextStyle((prev) => ({
                  ...prev,
                  letterSpacing: value,
                }));
              }}
              disabled={defaultTextStyle.letterSpacing === undefined}
              unit={t("units.em")}
            />
          </div>

          {/* 単語の間隔 */}
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={defaultTextStyle.wordSpacing !== undefined}
                onChange={(e) => {
                  setTextStyleStatus("changed");
                  setDefaultTextStyle((prev) => {
                    if (e.target.checked) {
                      return {
                        ...prev,
                        wordSpacing: prev.wordSpacing ?? 0.0,
                      };
                    }
                    // biome-ignore lint/correctness/noUnusedVariables: wordSpacing is intentionally destructured to remove it
                    const { wordSpacing, ...rest } = prev;
                    return rest;
                  });
                }}
                className="w-4 h-4"
              />
              <span className="text-sm text-stone-700 dark:text-stone-300">
                {t("options.enableWordSpacing")}
              </span>
            </label>
            <SettingSlider
              min={0.0}
              max={0.5}
              step={0.01}
              label={t("textStyle.wordSpacing")}
              value={defaultTextStyle.wordSpacing ?? 0.0}
              onChange={(value) => {
                setTextStyleStatus("changed");
                setDefaultTextStyle((prev) => ({
                  ...prev,
                  wordSpacing: value,
                }));
              }}
              disabled={defaultTextStyle.wordSpacing === undefined}
              unit={t("units.em")}
            />
          </div>

          {/* 保存・リセットボタン */}
          <div className="flex flex-wrap items-center gap-2">
            <Button
              appearance="primary"
              onClick={saveDefaultSettings}
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
              onClick={resetToDefaults}
              disabled={isSaving || textStyleStatus === "default"}
            >
              {t("options.resetToDefaults")}
            </Button>
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
          <Button
            appearance="secondary"
            onClick={clearAllSettings}
            disabled={isClearing}
          >
            {t("options.clearSettings")}
          </Button>
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
