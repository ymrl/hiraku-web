import { browser } from "wxt/browser";
import type { UserInterfaceSettings } from "@/types";

export const loadUserInterfaceSettings =
  async (): Promise<UserInterfaceSettings> => {
    try {
      const result = await browser.storage.sync.get("userInterfaceSettings");
      return {
        showButtonOnPage: false,
        ...result.userInterfaceSettings,
      };
    } catch (err) {
      console.error("Failed to load UI settings:", err);
      return {
        showButtonOnPage: false,
      };
    }
  };

export const saveUserInterfaceSettings = async (
  settings: Partial<UserInterfaceSettings>,
): Promise<void> => {
  try {
    await browser.storage.sync.set({
      userInterfaceSettings: {
        ...settings,
      },
    });
  } catch (err) {
    console.error("Failed to save UI settings:", err);
  }
};
