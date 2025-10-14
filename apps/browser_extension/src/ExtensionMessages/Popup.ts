export type SelectTab = {
  action: "selectTab";
  tab: "tableOfContents" | "text" | "speech";
};
export type SelectTabResponse = SelectTab & {
  success: boolean;
};
