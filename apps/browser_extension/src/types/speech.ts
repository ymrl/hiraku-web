export interface SpeechSettings {
  rate?: number; // 0.1〜10の範囲、デフォルト1
  pitch?: number; // 0〜2の範囲、デフォルト1
  volume?: number; // 0〜1の範囲、デフォルト1
  voice?: string; // 音声名、デフォルトはブラウザの設定
}

export type SpeechMessage =
  | {
      action: "enableSpeech" | "disableSpeech" | "updateSpeechSettings";
      settings?: SpeechSettings;
    }
  | {
      action: "speechStatus";
      isEnabled?: boolean;
    };
