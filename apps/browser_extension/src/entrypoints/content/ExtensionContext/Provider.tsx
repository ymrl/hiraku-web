import type { ReactNode } from "react";
import { NavigationContext, useNavigation } from "@/TableOfContents";
import { ExtensionContext } from "./ExtensionContext";
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

  const navigationContextValues = useNavigation();
  const useUserInterfaceSettingsReturn = useUserInterfaceSettings();

  return (
    <NavigationContext value={navigationContextValues}>
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
          ...useUserInterfaceSettingsReturn,
        }}
      >
        {children}
      </ExtensionContext>
    </NavigationContext>
  );
};
