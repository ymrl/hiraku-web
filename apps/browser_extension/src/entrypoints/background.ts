import { createI18n } from "@wxt-dev/i18n";
import { browser } from "wxt/browser";
import { defineBackground } from "wxt/utils/define-background";
import { loadHostTextStyle } from "@/TextStyle";

const { t } = createI18n();

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

  browser.runtime.onInstalled.addListener(() => {
    browser.contextMenus.create({
      id: "root",
      title: t("extesionName"),
      contexts: ["all"],
    });
    browser.contextMenus.create({
      id: "openHeadingsList",
      parentId: "root",
      title: t("contextMenu.openHeadingsList"),
      contexts: ["all"],
    });
    browser.contextMenus.create({
      id: "openLandmarksList",
      parentId: "root",
      title: t("contextMenu.openLandmarksList"),
      contexts: ["all"],
    });
    browser.contextMenus.create({
      id: "openTextSettings",
      parentId: "root",
      title: t("contextMenu.openTextSettings"),
      contexts: ["all"],
    });
  });

  browser.contextMenus.onClicked.addListener((info) => {
    if (info.menuItemId === "openHeadingsList") {
      openHeadingsList();
      return;
    }
    if (info.menuItemId === "openLandmarksList") {
      openLandmarksList();
      return;
    }
    if (info.menuItemId === "openTextSettings") {
      openTextSettings();
      return;
    }
  });
});

const openHeadingsList = async () => {
  try {
    await browser.storage.local.set({ activeTab: "headings" });
    await browser.action.openPopup();
  } catch (err) {
    console.error("Failed to open popup:", err);
  }
  try {
    browser.runtime.sendMessage({ action: "selectHeadingsTab" });
  } catch (err) {
    console.error("Failed to send message to popup:", err);
  }
};

const openLandmarksList = async () => {
  try {
    await browser.storage.local.set({ activeTab: "landmarks" });
    await browser.action.openPopup();
  } catch (err) {
    console.error("Failed to open popup:", err);
  }
  try {
    browser.runtime.sendMessage({ action: "selectLandmarksTab" });
  } catch (err) {
    console.error("Failed to send message to popup:", err);
  }
};

const openTextSettings = async () => {
  try {
    await browser.storage.local.set({ activeTab: "text" });
    await browser.action.openPopup();
  } catch (err) {
    console.error("Failed to open popup:", err);
  }
  try {
    browser.runtime.sendMessage({ action: "selectTextTab" });
  } catch (err) {
    console.error("Failed to send message to popup:", err);
  }
};
