import { browser } from "wxt/browser";
import { defineBackground } from "wxt/utils/define-background";

export default defineBackground(() => {
  browser.runtime.onMessage.addListener((request, _sender, sendResponse) => {
    if (request.action === "getTextStyleSettings") {
      const hostname = request.hostname;
      if (hostname) {
        browser.storage.local
          .get(`textStyle_${hostname}`)
          .then((result) => {
            sendResponse(result[`textStyle_${hostname}`] || null);
          })
          .catch((err) => {
            console.error("Failed to get text style settings:", err);
            sendResponse(null);
          });
        return true; // 非同期レスポンスを示す
      }
    }
    return false;
  });
});
