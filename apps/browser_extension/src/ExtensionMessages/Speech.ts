import type { SpeechSettings } from "@/types";

export type EnableSpeech = {
  action: "enableSpeech";
  settings: SpeechSettings | undefined;
};
export type EnableSpeechResponse = undefined;

export type DisableSpeech = {
  action: "disableSpeech";
};
export type DisableSpeechResponse = undefined;

export type UpdateSpeechSettings = {
  action: "updateSpeechSettings";
  settings: SpeechSettings | undefined;
};
export type UpdateSpeechSettingsResponse = undefined;

export type SpeechStatus = {
  action: "speechStatus";
};

export type SpeechStatusResponse = {
  action: "speechStatus";
  isEnabled: boolean;
};

export type SpeechEnabled = {
  action: "speechEnabled";
};
export type SpeechEnabledResponse = undefined;

export type SpeechDisabled = {
  action: "speechDisabled";
};
export type SpeechDisabledResponse = undefined;

export type GetSpeechSettings = {
  action: "getSpeechSettings";
};
export type GetSpeechSettingsResponse = {
  action: "getSpeechSettings";
  settings: SpeechSettings;
};

export type SaveSpeechSettings = {
  action: "saveSpeechSettings";
  settings: SpeechSettings;
};
export type SaveSpeechSettingsResponse = undefined;

export type RemoveSpeechSettings = {
  action: "removeSpeechSettings";
};
export type RemoveSpeechSettingsResponse = undefined;
