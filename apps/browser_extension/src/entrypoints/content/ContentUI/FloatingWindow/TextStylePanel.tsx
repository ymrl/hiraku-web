import { use } from "react";
import { TextStyle } from "@/components/TextStyle";
import { loadDefaultTextStyleSettings, removeHostTextStyle } from "@/storage";
import type { TextStyleSettings } from "@/types";
import { ExtensionContext } from "../../ExtensionContext";

const saveHostTextStyle = async (host: string, settings: TextStyleSettings) => {
  await saveHostTextStyle(host, settings);
};

export const TextStylePanel = () => {
  const { currentTextStyle, pageDefaultTextStyle, updateCurrentTextStyle } =
    use(ExtensionContext);

  const host = location.hostname;

  return (
    <TextStyle
      currentTextStyle={currentTextStyle}
      pageDefaultTextStyle={pageDefaultTextStyle}
      onChangeTextStyle={(style) => {
        updateCurrentTextStyle(style);
        if (host) {
          saveHostTextStyle(host, style);
        }
      }}
      onResetToDefaults={async () => {
        await removeHostTextStyle(host);
        const defaults = await loadDefaultTextStyleSettings();
        updateCurrentTextStyle(defaults);
      }}
    />
  );
};
