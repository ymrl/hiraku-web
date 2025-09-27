import { browser } from "wxt/browser";
import type { TextStyleSettings } from "@/types";
import { loadDefaultTextStyleSettings } from "./loadDefaultTextStyleSettings";

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
      console.log("Loaded host settings for", host, hostSettings);
      return hostSettings;
    }
  } catch (err) {
    console.error("Failed to load host settings:", err);
    return undefined;
  }
};
