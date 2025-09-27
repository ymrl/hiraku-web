import { browser } from "wxt/browser";
import { defineContentScript } from "wxt/utils/define-content-script";
import { getHeadings, getLandmarks } from "./collection";
import { createRootElement } from "./Root";

export default defineContentScript({
  matches: ["<all_urls>"],
  main() {
    // DOM読み込み完了後にReact Rootを初期化
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", createRootElement);
    } else {
      createRootElement();
    }

    // ポップアップからのメッセージをリスンし、ページ情報を返す
    browser.runtime.onMessage.addListener((message, _sender, sendResponse) => {
      if (message.action === "getHeadings") {
        const headings = getHeadings();
        sendResponse({ headings });
        return true;
      }
      if (message.action === "getLandmarks") {
        const landmarks = getLandmarks();
        sendResponse({ landmarks });
        return true;
      }
      // これ以外のメッセージは別の場所で処理している
    });
  },
});
