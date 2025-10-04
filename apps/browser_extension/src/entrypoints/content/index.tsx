import { defineContentScript } from "wxt/utils/define-content-script";
import {
  addListener,
  type GetHeadings,
  type GetLandmarks,
} from "@/ExtensionMessages";
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
    addListener<GetHeadings | GetLandmarks>(
      (message, _sender, sendResponse) => {
        const { action } = message;
        if (action === "getHeadings") {
          const headings = getHeadings();
          sendResponse({ action, headings });
          return true;
        }
        if (action === "getLandmarks") {
          const landmarks = getLandmarks();
          sendResponse({ action, landmarks });
          return true;
        }
        // これ以外のメッセージは別の場所で処理している
      },
    );
  },
});
