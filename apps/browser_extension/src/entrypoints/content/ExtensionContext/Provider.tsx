import type { ReactNode } from "react";
import { ExtensionContext } from "./ExtensionContext";
import { useNavigation } from "./useNavigation";
import { useSpeech } from "./useSpeech";
import { useTextStyle } from "./useTextStyle";
import { useUserInterfaceSettings } from "./useUserInterfaceSettings";

export const Provider = ({ children }: { children?: ReactNode }) => {
  const { currentTextStyle, pageDefaultTextStyle, updateCurrentTextStyle } =
    useTextStyle();

  const {
    isSpeechEnabled,
    enableSpeech,
    disableSpeech,
    speechSettings,
    updateSpeechSettings,
  } = useSpeech();

  const { xpaths, updateXpaths, navigationTimestamp } = useNavigation();
  const useUserInterfaceSettingsReturn = useUserInterfaceSettings();

  return (
    <ExtensionContext
      value={{
        currentTextStyle,
        updateCurrentTextStyle,
        pageDefaultTextStyle,
        isSpeechEnabled,
        speechSettings,
        updateSpeechSettings,
        enableSpeech,
        disableSpeech,
        xpaths,
        navigationTimestamp,
        updateXpaths,
        ...useUserInterfaceSettingsReturn,
      }}
    >
      {children}
    </ExtensionContext>
  );
};
