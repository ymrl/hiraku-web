import { browser } from "wxt/browser";
import { defineBackground } from "wxt/utils/define-background";

export default defineBackground(() => {
  browser.runtime.onMessage.addListener((request, _sender, sendResponse) => {
    if (request.action === "getTextStyleSettings") {
      const hostname = request.hostname;
      if (hostname) {
        browser.storage.local
          .get([`textStyle_${hostname}`, "defaultTextStyle"])
          .then((result) => {
            const hostSettings = result[`textStyle_${hostname}`];
            const defaultSettings = result.defaultTextStyle;
            // ホスト固有の設定がある場合はそれを、なければデフォルト設定を返す
            sendResponse(hostSettings || defaultSettings || null);
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
