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
