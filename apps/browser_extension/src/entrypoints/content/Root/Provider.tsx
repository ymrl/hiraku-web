import type { ReactNode } from "react";
import { SpeakerContext, useSpeaker } from "@/Speech";
import { NavigationContext, useNavigation } from "@/TableOfContents";
import { TextStyleContext, useTextStyle } from "@/TextStyle";

export const Provider = ({ children }: { children?: ReactNode }) => {
  const textStyleValues = useTextStyle();
  const speakerValues = useSpeaker();
  const navigationContextValues = useNavigation();

  return (
    <NavigationContext value={navigationContextValues}>
      <SpeakerContext value={speakerValues}>
        <TextStyleContext value={textStyleValues}>{children}</TextStyleContext>
      </SpeakerContext>
    </NavigationContext>
  );
};
