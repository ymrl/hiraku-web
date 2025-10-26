import { use } from "react";
import { TextStyle } from "@/components/TextStyle";
import {
  loadDefaultTextStyleSettings,
  removeHostTextStyle,
  saveHostTextStyle,
} from "@/storage";
import { TextStyleContext } from "@/TextStyle";

export const TextStylePanel = () => {
  const { currentTextStyle, pageDefaultTextStyle, updateCurrentTextStyle } =
    use(TextStyleContext);

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
