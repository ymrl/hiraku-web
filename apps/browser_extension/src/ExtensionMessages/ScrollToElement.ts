export type ScrollToElement = {
  action: "scrollToElement";
  xpaths: string[];
};
export type ScrollToElementResponse = {
  action: "scrollToElement";
  success: boolean;
};
