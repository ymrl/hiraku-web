export type SelectTab = {
  action: "selectTab";
  tab: "headings" | "landmarks" | "text" | "speech";
};
export type SelectTabResponse = SelectTab & {
  success: boolean;
};
