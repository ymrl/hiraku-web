import { use } from "react";
import { TextStyle } from "@/components/TextStyle";
import { sendMessage } from "@/ExtensionMessages";
import { loadDefaultTextStyleSettings } from "@/TextStyle";
import type { TextStyleSettings } from "@/types";
import { ExtensionContext } from "../../ExtensionContext";

const saveHostTextStyle = async (host: string, settings: TextStyleSettings) => {
  sendMessage({
    action: "saveHostTextStyle",
    hostname: host,
    settings: settings,
  });
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
        if (host) {
          await sendMessage({
            action: "removeHostTextStyle",
            hostname: host,
          });
        }
        const defaults = await loadDefaultTextStyleSettings();
        updateCurrentTextStyle(defaults);
      }}
    />
  );
};
