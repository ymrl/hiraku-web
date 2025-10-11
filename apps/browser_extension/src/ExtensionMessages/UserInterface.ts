import type { UserInterfaceSettings } from "@/types";

export type GetUserInterfaceSettings = {
  action: "getUserInterfaceSettings";
};

export type GetUserInterfaceSettingsResponse = {
  action: "getUserInterfaceSettings";
  settings: UserInterfaceSettings;
};
