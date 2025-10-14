import { useCallback, useRef, useState } from "react";
import { loadUserInterfaceSettings } from "@/storage";
import type { UserInterfaceSettings } from "@/types";

export const useUserInterfaceSettings = () => {
  const [userInterfaceSettings, setUserInterfaceSettings] =
    useState<UserInterfaceSettings>({
      showButtonOnPage: false,
    });

  const initUserInterfaceSettings = useCallback(async () => {
    setUserInterfaceSettings(await loadUserInterfaceSettings());
  }, []);

  const loadedRef = useRef(false);
  if (!loadedRef.current) {
    loadedRef.current = true;
    initUserInterfaceSettings();
  }

  return {
    userInterfaceSettings,
  };
};
