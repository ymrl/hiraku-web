import type { OpenUserInterface, OpenUserInterfaceResponse } from "./Content";
import type { GetHeadings, GetHeadingsResponse } from "./GetHeadings";
import type { GetLandmarks, GetLandmarksResponse } from "./GetLandmarks";
import type { SelectTab, SelectTabResponse } from "./Popup";
import type {
  ScrollToElement,
  ScrollToElementResponse,
} from "./ScrollToElement";
import type {
  DisableSpeech,
  DisableSpeechResponse,
  EnableSpeech,
  EnableSpeechResponse,
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
  GetPageTextStyle,
  GetPageTextStyleResponse,
  UpdateTextStyle,
  UpdateTextStyleResponse,
} from "./TextStyleSettings";

export type ExtensionMessage =
  | GetHeadings
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
  | SelectTab
  | OpenUserInterface;
export type ExtensionMessageResponse =
  | GetHeadingsResponse
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
  | SelectTabResponse
  | OpenUserInterfaceResponse;

type ExtractResponse<M extends ExtensionMessage> = M extends {
  action: infer A;
}
  ? ExtensionMessageResponse & { action: A }
  : never;

export type ResponseForMessage<M extends ExtensionMessage> = ExtractResponse<M>;
