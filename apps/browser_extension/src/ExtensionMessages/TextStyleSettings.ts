import type { TextStyleSettings } from "../types";

export type GetHostTextStyleSettings = {
  action: "getHostTextStyleSettings";
  hostname: string;
};

export type GetHostTextStyleSettingsResponse = {
  action: "getHostTextStyleSettings";
  settings: TextStyleSettings | undefined;
};

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
