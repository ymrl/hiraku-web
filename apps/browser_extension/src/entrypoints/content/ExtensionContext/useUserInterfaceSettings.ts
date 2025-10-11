import { useCallback, useRef, useState } from "react";
import { sendMessage } from "@/ExtensionMessages";
import type { UserInterfaceSettings } from "@/types";

export const useUserInterfaceSettings = () => {
  const [userInterfaceSettings, setUserInterfaceSettings] =
    useState<UserInterfaceSettings>({
      showButtonOnPage: false,
    });

  const loadUserInterfaceSettings = useCallback(async () => {
    const { settings } = await sendMessage({
      action: "getUserInterfaceSettings",
    });
    setUserInterfaceSettings((prev) => ({ ...prev, ...settings }));
  }, []);

  const loadedRef = useRef(false);
  if (!loadedRef.current) {
    loadedRef.current = true;
    try {
      loadUserInterfaceSettings();
    } catch (err) {
      console.error("Failed to load UI settings:", err);
    }
  }

  return {
    userInterfaceSettings,
  };
};
