import { createContext } from "react";
import type { SpeechSettings } from "@/types";

export const SpeakerContext = createContext<{
  isSpeechEnabled: boolean;
  speechSettings: SpeechSettings | undefined;
  updateSpeechSettings: (settings: SpeechSettings) => void;
  enableSpeech: () => void;
  disableSpeech: () => void;
}>({
  isSpeechEnabled: false,
  speechSettings: undefined,
  updateSpeechSettings: () => {},
  enableSpeech: () => {},
  disableSpeech: () => {},
});
