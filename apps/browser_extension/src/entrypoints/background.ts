import { browser } from "wxt/browser";
import { defineBackground } from "wxt/utils/define-background";

const getTextStyleSettings = async (hostname: string) => {
  try {
    const hostStyle = await browser.storage.local.get(`textStyle_${hostname}`);
    if (hostStyle[`textStyle_${hostname}`]) {
      return hostStyle[`textStyle_${hostname}`];
    }
  } catch (err) {
    console.error("Failed to get host-specific text style:", err);
  }

  try {
    const defaultStyle = await browser.storage.sync.get("defaultTextStyle");
    return defaultStyle.defaultTextStyle || null;
  } catch (err) {
    console.error("Failed to get default text style:", err);
    return null;
  }
};

export default defineBackground(() => {
  browser.runtime.onMessage.addListener((request, _sender, sendResponse) => {
    if (request.action === "getTextStyleSettings") {
      const hostname = request.hostname;
      if (!hostname) {
        sendResponse(null);
        return true;
      }
      getTextStyleSettings(hostname).then((result) => {
        sendResponse(result);
      });
      return true; // 非同期レスポンスを示す
    }
    return false;
  });
});
