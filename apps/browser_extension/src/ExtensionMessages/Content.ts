export type OpenUserInterface = {
  action: "openUserInterface";
  tab: "tableOfContents" | "text" | "speech";
  frameUrl?: string;
};
export type OpenUserInterfaceResponse = {
  action: "openHeadingsList";
  success: boolean;
};
