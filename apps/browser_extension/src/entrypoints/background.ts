import { browser } from "wxt/browser";
import { defineBackground } from "wxt/utils/define-background";
import { loadHostTextStyle } from "@/TextStyle";

export default defineBackground(() => {
  browser.runtime.onMessage.addListener((request, _sender, sendResponse) => {
    if (request.action === "getTextStyleSettings") {
      const hostname = request.hostname;
      if (!hostname) {
        sendResponse(undefined);
        return true;
      }
      loadHostTextStyle(hostname).then((result) => {
        sendResponse(result);
      });
      return true; // 非同期レスポンスを示す
    }
    return false;
  });
});
