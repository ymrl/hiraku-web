export type OpenUserInterface = {
  action: "openUserInterface";
  tab: "tableOfContents" | "text" | "speech";
  frameUrl?: string;
};
export type OpenUserInterfaceResponse = {
  action: "openHeadingsList";
  success: boolean;
};

export type ScrollToElement = {
  action: "scrollToElement";
  xpaths: string[];
};
export type ScrollToElementResponse = {
  action: "scrollToElement";
  success: boolean;
};

export type ContentMessages = OpenUserInterface | ScrollToElement;
export type ContentMessageResponses =
  | OpenUserInterfaceResponse
  | ScrollToElementResponse;
