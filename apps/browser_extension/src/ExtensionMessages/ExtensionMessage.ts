import type { GetHeadings, GetHeadingsResponse } from "./GetHeadings";
import type { GetLandmarks, GetLandmarksResponse } from "./GetLandmarks";
import type {
  SelectHeadingsTab,
  SelectHeadingsTabResponse,
  SelectLandmarksTab,
  SelectLandmarksTabResponse,
  SelectSpeechTab,
  SelectSpeechTabResponse,
  SelectTextTab,
  SelectTextTabResponse,
} from "./Popup";
import type {
  ScrollToElement,
  ScrollToElementResponse,
} from "./ScrollToElement";
import type {
  DisableSpeech,
  DisableSpeechResponse,
  EnableSpeech,
  EnableSpeechResponse,
  GetSpeechSettings,
  GetSpeechSettingsResponse,
  RemoveSpeechSettings,
  RemoveSpeechSettingsResponse,
  SaveSpeechSettings,
  SaveSpeechSettingsResponse,
  SpeechDisabled,
  SpeechDisabledResponse,
  SpeechEnabled,
  SpeechEnabledResponse,
  SpeechStatus,
  SpeechStatusResponse,
  UpdateSpeechSettings,
  UpdateSpeechSettingsResponse,
} from "./Speech";
import type {
  GetHostTextStyleSettings,
  GetHostTextStyleSettingsResponse,
  GetPageTextStyle,
  GetPageTextStyleResponse,
  RemoveHostTextStyle,
  RemoveHostTextStyleResponse,
  SaveHostTextStyle,
  SaveHostTextStyleResponse,
  UpdateTextStyle,
  UpdateTextStyleResponse,
} from "./TextStyleSettings";

export type ExtensionMessage =
  | GetHeadings
  | GetHostTextStyleSettings
  | UpdateTextStyle
  | GetPageTextStyle
  | GetLandmarks
  | EnableSpeech
  | DisableSpeech
  | UpdateSpeechSettings
  | SpeechStatus
  | SpeechDisabled
  | SpeechEnabled
  | ScrollToElement
  | SelectHeadingsTab
  | SelectLandmarksTab
  | SelectTextTab
  | SelectSpeechTab
  | SaveHostTextStyle
  | RemoveHostTextStyle
  | SaveSpeechSettings
  | RemoveSpeechSettings
  | GetSpeechSettings;
export type ExtensionMessageResponse =
  | GetHeadingsResponse
  | GetHostTextStyleSettingsResponse
  | UpdateTextStyleResponse
  | GetPageTextStyleResponse
  | GetLandmarksResponse
  | EnableSpeechResponse
  | DisableSpeechResponse
  | UpdateSpeechSettingsResponse
  | SpeechStatusResponse
  | SpeechDisabledResponse
  | SpeechEnabledResponse
  | ScrollToElementResponse
  | SelectHeadingsTabResponse
  | SelectLandmarksTabResponse
  | SelectTextTabResponse
  | SelectSpeechTabResponse
  | SaveHostTextStyleResponse
  | RemoveHostTextStyleResponse
  | SaveSpeechSettingsResponse
  | RemoveSpeechSettingsResponse
  | GetSpeechSettingsResponse;

type ExtractResponse<M extends ExtensionMessage> = M extends {
  action: infer A;
}
  ? ExtensionMessageResponse & { action: A }
  : never;

export type ResponseForMessage<M extends ExtensionMessage> = ExtractResponse<M>;
