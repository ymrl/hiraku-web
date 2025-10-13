import { defineBackground } from "wxt/utils/define-background";
import { addContextMenus } from "./addContextMenus";

export default defineBackground(() => {
  addContextMenus();
});
