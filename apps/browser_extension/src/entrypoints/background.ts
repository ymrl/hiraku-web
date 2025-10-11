import { createI18n } from "@wxt-dev/i18n";
import { browser } from "wxt/browser";
import { defineBackground } from "wxt/utils/define-background";
import { getCurrentTabId } from "@/browser/getCurrentTabId";
import {
  addListener,
  sendMessage,
  sendMessageToTab,
} from "@/ExtensionMessages";
import { loadHostTextStyle } from "@/TextStyle";

const { t } = createI18n();

export default defineBackground(() => {
  addListener((request, _sender, sendResponse) => {
    const { action } = request;
    if (action === "getHostTextStyleSettings") {
      const hostname = request.hostname;
      if (!hostname) {
        sendResponse({ action, settings: undefined });
        return true;
      }
      loadHostTextStyle(hostname).then((settings) => {
        sendResponse({ action, settings });
      });
      return true;
    }
    if (action === "speechEnabled") {
      browser.contextMenus.update("speech", { checked: true });
    }
    if (action === "speechDisabled") {
      browser.contextMenus.update("speech", { checked: false });
    }
    if (action === "saveHostTextStyle") {
      const { hostname, settings } = request;
      if (hostname || settings) {
        try {
          browser.storage.local.set({
            [`textStyle_${hostname}`]: settings,
          });
        } catch (err) {
          console.error("Failed to save text style settings:", err);
        }
      }
    }
    if (action === "removeHostTextStyle") {
      const { hostname } = request;
      if (hostname) {
        try {
          browser.storage.local.remove(`textStyle_${hostname}`).then(() => {
            sendResponse({ action, success: true });
          });
          return true;
        } catch (err) {
          console.error("Failed to remove text style settings:", err);
        }
      }
    }
    if (action === "saveSpeechSettings") {
      const { settings } = request;
      if (settings) {
        try {
          browser.storage.local.set({
            speechSettings: settings,
          });
        } catch (err) {
          console.error("Failed to save speech settings:", err);
        }
      }
    }
    if (action === "removeSpeechSettings") {
      try {
        browser.storage.local.remove("speechSettings");
      } catch (err) {
        console.error("Failed to remove speech settings:", err);
      }
    }
    if (action === "getSpeechSettings") {
      try {
        browser.storage.local.get("speechSettings").then((result) => {
          sendResponse({
            action,
            settings: result.speechSettings || {},
          });
        });
        return true;
      } catch (err) {
        console.error("Failed to get speech settings:", err);
        sendResponse({ action, settings: {} });
      }
    }
  });

  browser.runtime.onInstalled.addListener(() => {
    browser.contextMenus.create({
      id: "root",
      title: t("extensionName"),
      contexts: ["all"],
    });
    browser.contextMenus.create({
      id: "speech",
      parentId: "root",
      title: t("contextMenu.speech"),
      contexts: ["all"],
      type: "checkbox",
    });
    if (browser.action) {
      browser.contextMenus.create({
        id: "separator1",
        parentId: "root",
        type: "separator",
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
      browser.contextMenus.create({
        id: "openSpeechSettings",
        parentId: "root",
        title: t("contextMenu.openSpeechSettings"),
        contexts: ["all"],
      });
    }
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
    if (info.menuItemId === "openSpeechSettings") {
      openSpeechSettings();
      return;
    }
    if (info.menuItemId === "speech") {
      toggleSpeech(info.checked);
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
    sendMessage({ action: "selectHeadingsTab" });
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
    sendMessage({ action: "selectLandmarksTab" });
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
    sendMessage({ action: "selectTextTab" });
  } catch (err) {
    console.error("Failed to send message to popup:", err);
  }
};

const openSpeechSettings = async () => {
  try {
    await browser.storage.local.set({ activeTab: "speech" });
    await browser.action.openPopup();
  } catch (err) {
    console.error("Failed to open popup:", err);
  }
  try {
    sendMessage({ action: "selectSpeechTab" });
  } catch (err) {
    console.error("Failed to send message to popup:", err);
  }
};

const toggleSpeech = async (enabled: boolean | undefined) => {
  try {
    const tabId = await getCurrentTabId();
    if (!tabId) return;
    const settings = enabled
      ? await browser.storage.local.get("speechSettings")
      : undefined;

    if (enabled) {
      await sendMessageToTab(tabId, { action: "enableSpeech", settings });
    } else {
      await sendMessageToTab(tabId, { action: "disableSpeech" });
    }
  } catch (err) {
    console.error("Failed to send speech message:", err);
  }
};
