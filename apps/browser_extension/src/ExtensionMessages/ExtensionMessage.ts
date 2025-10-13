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
import type {
  GetUserInterfaceSettings,
  GetUserInterfaceSettingsResponse,
} from "./UserInterface";

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
  | SelectTab
  | SaveHostTextStyle
  | RemoveHostTextStyle
  | SaveSpeechSettings
  | RemoveSpeechSettings
  | GetSpeechSettings
  | GetUserInterfaceSettings
  | OpenUserInterface;
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
  | SelectTabResponse
  | SaveHostTextStyleResponse
  | RemoveHostTextStyleResponse
  | SaveSpeechSettingsResponse
  | RemoveSpeechSettingsResponse
  | GetSpeechSettingsResponse
  | GetUserInterfaceSettingsResponse
  | OpenUserInterfaceResponse;

type ExtractResponse<M extends ExtensionMessage> = M extends {
  action: infer A;
}
  ? ExtensionMessageResponse & { action: A }
  : never;

export type ResponseForMessage<M extends ExtensionMessage> = ExtractResponse<M>;
