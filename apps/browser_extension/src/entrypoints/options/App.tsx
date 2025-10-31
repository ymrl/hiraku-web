import { createI18n } from "@wxt-dev/i18n";
import { useCallback, useRef, useState } from "react";
import { ContentUI } from "@/components/ContentUI";
import { LandmarkNavigation } from "@/components/LandmarkNavigation";
import { TextCSS } from "@/components/TextCSS";
import { SpeakerContext, useSpeaker } from "@/Speech";
import {
  loadDefaultTextStyleSettings,
  loadUserInterfaceSettings,
  saveHostTextStyle,
} from "@/storage";
import {
  NavigationContext,
  useNavigation,
  useRespondingTableOfContentsMessage,
} from "@/TableOfContents";
import { TextStyleContext, useTextStyle } from "@/TextStyle";
import type { UserInterfaceSettings } from "@/types";
import { useWindowSize } from "@/utils/useWindowSize";
import { Speaker } from "../../components/Speaker";
import { TextStyleTweaker } from "../../components/TextStyleTweaker";
import type { TextStyleSettings } from "../../types/text";
import { ClearSettingsSection } from "./ClearSettingsSection";
import { TextStyleSection } from "./TextStyleSection";
import { UserInterfaceSection } from "./UserInterfaceSection";

const { t } = createI18n();

function App({ rootRef }: { rootRef: React.RefObject<HTMLElement | null> }) {
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
  useRespondingTableOfContentsMessage({});
  const navigaitonValuses = useNavigation();
  const speakerValues = useSpeaker();
  const textStyleValues = useTextStyle();
  const windowSize = useWindowSize();

  return (
    <NavigationContext value={navigaitonValuses}>
      <SpeakerContext value={speakerValues}>
        <TextStyleContext value={textStyleValues}>
          <div className="min-h-screen bg-stone-100 dark:bg-stone-900 sm:p-8 p-4">
            <h1 className="mb-4 text-xl font-bold text-rose-600 dark:text-rose-300">
              {t("options.pageTitle")}
            </h1>
            <div className="space-y-4">
              <UserInterfaceSection
                userInterfaceSettings={userInterfaceSettings}
                onSave={(settings) => {
                  setUserInterfaceSettings(settings);
                }}
              />

              <TextStyleSection
                defaultTextStyle={defaultTextStyle}
                onSavedDefaultTextStyle={(settings) => {
                  setDefaultTextStyle(settings);
                  const hostSettings = {
                    ...textStyleValues.currentTextStyle,
                    ...settings,
                  };
                  textStyleValues.updateCurrentTextStyle(hostSettings);
                  saveHostTextStyle(window.location.hostname, hostSettings);
                }}
              />

              <ClearSettingsSection />
            </div>
          </div>
          <ContentUI
            {...windowSize}
            userIntefaceSettings={userInterfaceSettings}
          />
          <LandmarkNavigation rootRef={rootRef} />
          <TextCSS settings={defaultTextStyle || {}} />
          <Speaker />
          <TextStyleTweaker />
        </TextStyleContext>
      </SpeakerContext>
    </NavigationContext>
  );
}

export default App;
