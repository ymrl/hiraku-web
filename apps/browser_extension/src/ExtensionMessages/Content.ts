export type OpenUserInterface = {
  action: "openUserInterface";
  tab: "headings" | "landmarks" | "text" | "speech";
  frameUrl?: string;
};
export type OpenUserInterfaceResponse = {
  action: "openHeadingsList";
  success: boolean;
};
