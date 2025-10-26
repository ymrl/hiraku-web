import { createContext } from "react";
import type {
  SpeechSettings,
  TextStyleSettings,
  UserInterfaceSettings,
} from "@/types";

export const ExtensionContext = createContext<{
  currentTextStyle: TextStyleSettings | undefined;
  updateCurrentTextStyle: (style: TextStyleSettings | undefined) => void;
  pageDefaultTextStyle: TextStyleSettings | undefined;
  isSpeechEnabled: boolean;
  speechSettings: SpeechSettings | undefined;
  updateSpeechSettings: (settings: SpeechSettings) => void;
  enableSpeech: () => void;
  disableSpeech: () => void;
  userInterfaceSettings: UserInterfaceSettings;
}>({
  currentTextStyle: undefined,
  pageDefaultTextStyle: undefined,
  updateCurrentTextStyle: () => {},
  isSpeechEnabled: false,
  speechSettings: undefined,
  updateSpeechSettings: () => {},
  enableSpeech: () => {},
  disableSpeech: () => {},
  userInterfaceSettings: { showButtonOnPage: false },
});
