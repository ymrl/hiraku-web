import type { ReactNode } from "react";
import { SpeakerContext, useSpeaker } from "@/Speech";
import { NavigationContext, useNavigation } from "@/TableOfContents";
import { ExtensionContext } from "./ExtensionContext";
import { useTextStyle } from "./useTextStyle";
import { useUserInterfaceSettings } from "./useUserInterfaceSettings";

export const Provider = ({ children }: { children?: ReactNode }) => {
  const textstyleValues = useTextStyle();
  const speakerValues = useSpeaker();
  const navigationContextValues = useNavigation();
  const useUserInterfaceSettingsReturn = useUserInterfaceSettings();

  return (
    <NavigationContext value={navigationContextValues}>
      <SpeakerContext value={speakerValues}>
        <ExtensionContext
          value={{
            ...textstyleValues,
            ...useUserInterfaceSettingsReturn,
          }}
        >
          {children}
        </ExtensionContext>
      </SpeakerContext>
    </NavigationContext>
  );
};
