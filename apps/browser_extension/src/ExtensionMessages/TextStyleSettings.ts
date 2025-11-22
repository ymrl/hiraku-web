import type { TextStyleSettings } from "../types";

export type UpdateTextStyle = {
  action: "updateTextStyle";
  settings: TextStyleSettings;
};

export type UpdateTextStyleResponse = {
  action: "updateTextStyle";
  success: boolean;
};

export type GetPageTextStyle = {
  action: "getPageTextStyle";
};

export type GetPageTextStyleResponse = {
  action: "getPageTextStyle";
  pageTextStyle: TextStyleSettings;
};

export type TextStyleSettingsMessages = UpdateTextStyle | GetPageTextStyle;

export type TextStyleSettingsMessageResponses =
  | UpdateTextStyleResponse
  | GetPageTextStyleResponse;
