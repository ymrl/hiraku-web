import { defineContentScript } from "wxt/utils/define-content-script";
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
  },
});
