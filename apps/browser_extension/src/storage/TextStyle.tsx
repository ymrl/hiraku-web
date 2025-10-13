import { browser } from "wxt/browser";
import type { TextStyleSettings } from "@/types";

export const loadDefaultTextStyleSettings = async (): Promise<
  TextStyleSettings | undefined
> => {
  try {
    const result = await browser.storage.sync.get("defaultTextStyle");
    const defaults = result.defaultTextStyle;
    return defaults;
  } catch (err) {
    console.error("Failed to load default settings:", err);
    return undefined;
  }
};
export const saveDefaultTextStyleSettings = async (
  settings: TextStyleSettings,
) => {
  try {
    await browser.storage.sync.set({ defaultTextStyle: settings });
  } catch (err) {
    console.error("Failed to save default text style settings:", err);
  }
};

export const removeDefaultTextStyleSettings = async () => {
  try {
    await browser.storage.sync.remove("defaultTextStyle");
  } catch (err) {
    console.error("Failed to remove default text style settings:", err);
  }
};

export const loadHostTextStyle = async (
  host: string,
): Promise<TextStyleSettings | undefined> => {
  // ホスト固有の設定を取得
  const hostSettings = await loadHostSettings(host);
  if (hostSettings) {
    return hostSettings;
  }

  // ホスト固有の設定がない場合、デフォルト設定を取得
  const defaultSettings = await loadDefaultTextStyleSettings();
  return defaultSettings;
};

const loadHostSettings = async (
  host: string,
): Promise<TextStyleSettings | undefined> => {
  try {
    const result = await browser.storage.local.get(`textStyle_${host}`);
    const hostSettings = result[`textStyle_${host}`];
    if (hostSettings) {
      return hostSettings;
    }
  } catch (err) {
    console.error("Failed to load host settings:", err);
    return undefined;
  }
};

export const saveHostTextStyle = async (
  host: string,
  settings: TextStyleSettings,
) => {
  try {
    await browser.storage.local.set({
      [`textStyle_${host}`]: settings,
    });
  } catch (err) {
    console.error("Failed to save text style settings:", err);
  }
};

export const removeHostTextStyle = async (host: string) => {
  try {
    await browser.storage.local.remove(`textStyle_${host}`);
  } catch (err) {
    console.error("Failed to remove text style settings:", err);
  }
};
