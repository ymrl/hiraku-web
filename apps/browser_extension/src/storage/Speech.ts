import { browser } from "wxt/browser";
import type { SpeechSettings } from "@/types";

export const loadSpeechSettings = async (): Promise<
  SpeechSettings | undefined
> => {
  try {
    const result = await browser.storage.local.get("speechSettings");
    return result.speechSettings;
  } catch (err) {
    console.error("Failed to load speech settings:", err);
    return undefined;
  }
};

export const removeSpeechSettings = async (): Promise<void> => {
  try {
    await browser.storage.local.remove("speechSettings");
  } catch (err) {
    console.error("Failed to remove speech settings:", err);
  }
};

export const saveSpeechSettings = async (speechSettings: SpeechSettings) => {
  try {
    await browser.storage.local.set({
      speechSettings,
    });
  } catch (err) {
    console.error("Failed to save speech settings:", err);
  }
};
