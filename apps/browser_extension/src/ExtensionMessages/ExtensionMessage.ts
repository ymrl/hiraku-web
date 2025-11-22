import type { ContentMessageResponses, ContentMessages } from "./Content";
import type { PopupMessageResponses, PopupMessages } from "./Popup";
import type { SpeechMessageResponses, SpeechMessages } from "./Speech";
import type {
  TableOfContentsMessageResponses,
  TableOfContentsMessages,
} from "./TableOfContents";
import type {
  TextStyleSettingsMessageResponses,
  TextStyleSettingsMessages,
} from "./TextStyleSettings";

export type ExtensionMessage =
  | TextStyleSettingsMessages
  | TableOfContentsMessages
  | SpeechMessages
  | ContentMessages
  | PopupMessages;
export type ExtensionMessageResponse =
  | TextStyleSettingsMessageResponses
  | TableOfContentsMessageResponses
  | SpeechMessageResponses
  | ContentMessageResponses
  | PopupMessageResponses;

type ExtractResponse<M extends ExtensionMessage> = M extends {
  action: infer A;
}
  ? ExtensionMessageResponse & { action: A }
  : never;

export type ResponseForMessage<M extends ExtensionMessage> = ExtractResponse<M>;
