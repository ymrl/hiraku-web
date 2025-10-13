import { defineBackground } from "wxt/utils/define-background";
import { addContextMenus } from "./addContextMenus";
import { addMessageListeners } from "./addMessageListener";

export default defineBackground(() => {
  addMessageListeners();

  addContextMenus();
});
