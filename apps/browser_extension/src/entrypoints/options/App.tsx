import { createI18n } from "@wxt-dev/i18n";
import { useCallback, useRef, useState } from "react";
import { ContentUI } from "@/components/ContentUI";
import { LandmarkNavigation } from "@/components/LandmarkNavigation";
import { SpeakerContext, useSpeaker } from "@/Speech";
import {
  isAnyTextStyleSettingsSaved,
  loadDefaultTextStyleSettings,
  loadHostTextStyle,
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

  const [hostTextStyle, setHostTextStyle] = useState<
    TextStyleSettings | undefined
  >(undefined);

  const initDefaultSettings = useCallback(async () => {
    const defaultStyleResult = await loadDefaultTextStyleSettings();
    const hostStyleResult = await loadHostTextStyle(window.location.hostname, {
      withoutDefault: true,
    });
    if (defaultStyleResult) {
      setDefaultTextStyle(defaultStyleResult);
    }
    if (hostStyleResult) {
      setHostTextStyle(hostStyleResult);
    }
  }, []);

  const [userInterfaceSettings, setUserInterfaceSettings] =
    useState<UserInterfaceSettings>({
      showButtonOnPage: false,
    });

  const initUserInterfaceSettings = useCallback(async () => {
    setUserInterfaceSettings(await loadUserInterfaceSettings());
  }, []);

  const [isAnyHostSettingsSaved, setIsAnyHostSettingsSaved] =
    useState<boolean>(false);
  const loadIsSavedHostSettings = useCallback(async () => {
    setIsAnyHostSettingsSaved(await isAnyTextStyleSettingsSaved());
  }, []);

  const loadedRef = useRef(false);
  if (!loadedRef.current) {
    loadedRef.current = true;
    initDefaultSettings();
    initUserInterfaceSettings();
  }

  useRespondingTableOfContentsMessage({});
  const navigaitonValuses = useNavigation();
  const speakerValues = useSpeaker();
  const textStyleValues = useTextStyle({
    onChange: loadIsSavedHostSettings,
  });
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
                onSavedDefaultTextStyle={async (settings) => {
                  await setDefaultTextStyle(settings);
                  if (hostTextStyle) {
                    const style = {
                      ...hostTextStyle,
                      ...settings,
                    };
                    setHostTextStyle(style);
                    await saveHostTextStyle(window.location.hostname, style);
                  }
                  await textStyleValues.load(window.location.hostname);
                }}
                onResetDefaultTextStyle={async () => {
                  await setDefaultTextStyle(undefined);
                  await textStyleValues.load(window.location.hostname);
                }}
              />

              <ClearSettingsSection
                isExist={isAnyHostSettingsSaved}
                onExecuted={async () => {
                  await textStyleValues.load(window.location.hostname);
                }}
              />
            </div>
          </div>
          <ContentUI
            {...windowSize}
            userIntefaceSettings={userInterfaceSettings}
          />
          <LandmarkNavigation rootRef={rootRef} />
          <Speaker />
          <TextStyleTweaker />
        </TextStyleContext>
      </SpeakerContext>
    </NavigationContext>
  );
}

export default App;
