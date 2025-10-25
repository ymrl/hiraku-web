import { createI18n } from "@wxt-dev/i18n";
import { useCallback, useRef, useState } from "react";
import { TextCSS } from "@/components/TextCSS";
import {
  loadDefaultTextStyleSettings,
  loadUserInterfaceSettings,
} from "@/storage";
import type { UserInterfaceSettings } from "@/types";
import type { TextStyleSettings } from "../../types/text";
import { ClearSettingsSection } from "./ClearSettingsSection";
import { TextStyleSection } from "./TextStyleSection";
import { UserInterfaceSection } from "./UserInterfaceSection";

const { t } = createI18n();

function App() {
  const [defaultTextStyle, setDefaultTextStyle] = useState<
    TextStyleSettings | undefined
  >(undefined);

  const loadDefaultSettings = useCallback(async () => {
    const result = await loadDefaultTextStyleSettings();
    if (result) {
      setDefaultTextStyle(result);
    }
  }, []);

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
    loadDefaultSettings();
    initUserInterfaceSettings();
  }

  return (
    <div className="min-h-screen bg-stone-100 dark:bg-stone-900 sm:p-8 p-4">
      <h1 className="mb-4 text-xl font-bold text-rose-600 dark:text-rose-300">
        {t("options.pageTitle")}
      </h1>
      <div className="space-y-12">
        {/* テキストスタイルのデフォルト値設定 */}
        <TextStyleSection
          defaultTextStyle={defaultTextStyle}
          onSavedDefaultTextStyle={(settings) => {
            setDefaultTextStyle(settings);
          }}
        />
        <UserInterfaceSection
          userInterfaceSettings={userInterfaceSettings}
          onSave={(settings) => {
            setUserInterfaceSettings(settings);
          }}
        />
        <ClearSettingsSection />
      </div>
      <TextCSS settings={defaultTextStyle || {}} />
    </div>
  );
}

export default App;
