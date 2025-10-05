import { createContext } from "react";
import type { SpeechSettings, TextStyleSettings } from "@/types";

export const ExtensionContext = createContext<{
  currentTextStyle: TextStyleSettings | undefined;
  getHostTextStyle: (hostname: string) => Promise<void>;
  isSpeechEnabled: boolean;
  speechSettings: SpeechSettings | undefined;
  xpaths: string[];
  navigationTimestamp: number;
}>({
  currentTextStyle: undefined,
  getHostTextStyle: () => Promise.resolve(void 0),
  isSpeechEnabled: false,
  speechSettings: undefined,
  xpaths: [],
  navigationTimestamp: 0,
});
