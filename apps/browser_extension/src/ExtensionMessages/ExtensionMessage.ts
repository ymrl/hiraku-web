import type { OpenUserInterface, OpenUserInterfaceResponse } from "./Content";
import type {
  GetTableOfContents,
  GetTableOfContentsResponse,
} from "./GetTableOfContents";
import type {
  SelectedTab,
  SelectedTabResponse,
  SelectTab,
  SelectTabResponse,
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
  | UpdateTextStyle
  | GetPageTextStyle
  | GetTableOfContents
  | EnableSpeech
  | DisableSpeech
  | UpdateSpeechSettings
  | SpeechStatus
  | SpeechDisabled
  | SpeechEnabled
  | ScrollToElement
  | SelectTab
  | SelectedTab
  | OpenUserInterface;
export type ExtensionMessageResponse =
  | UpdateTextStyleResponse
  | GetPageTextStyleResponse
  | GetTableOfContentsResponse
  | EnableSpeechResponse
  | DisableSpeechResponse
  | UpdateSpeechSettingsResponse
  | SpeechStatusResponse
  | SpeechDisabledResponse
  | SpeechEnabledResponse
  | ScrollToElementResponse
  | SelectTabResponse
  | SelectedTabResponse
  | OpenUserInterfaceResponse;

type ExtractResponse<M extends ExtensionMessage> = M extends {
  action: infer A;
}
  ? ExtensionMessageResponse & { action: A }
  : never;

export type ResponseForMessage<M extends ExtensionMessage> = ExtractResponse<M>;
