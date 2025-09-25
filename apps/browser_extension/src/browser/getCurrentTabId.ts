import { browser } from "wxt/browser";

export const getCurrentTabId = async () => {
  const [tab] = await browser.tabs.query({
    active: true,
    currentWindow: true,
  });
  return tab?.id;
};
