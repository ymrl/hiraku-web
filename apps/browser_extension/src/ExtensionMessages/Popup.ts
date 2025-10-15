import type { ExtensionTab } from "@/storage";

export type SelectTab = {
  action: "selectTab";
  tab: ExtensionTab;
};
export type SelectTabResponse = SelectTab & {
  success: boolean;
};

export type SelectedTab = {
  action: "selectedTab";
  tab: ExtensionTab;
};

export type SelectedTabResponse = undefined;
