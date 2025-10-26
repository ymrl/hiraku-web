import type { ReactNode } from "react";
import { SpeakerContext, useSpeaker } from "@/Speech";
import { NavigationContext, useNavigation } from "@/TableOfContents";
import { TextStyleContext, useTextStyle } from "@/TextStyle";
import { ExtensionContext } from "./ExtensionContext";
import { useUserInterfaceSettings } from "./useUserInterfaceSettings";

export const Provider = ({ children }: { children?: ReactNode }) => {
  const textStyleValues = useTextStyle();
  const speakerValues = useSpeaker();
  const navigationContextValues = useNavigation();
  const userInterfaceSettings = useUserInterfaceSettings();

  return (
    <NavigationContext value={navigationContextValues}>
      <SpeakerContext value={speakerValues}>
        <TextStyleContext value={textStyleValues}>
          <ExtensionContext
            value={{
              ...userInterfaceSettings,
            }}
          >
            {children}
          </ExtensionContext>
        </TextStyleContext>
      </SpeakerContext>
    </NavigationContext>
  );
};
