import { createI18n } from "@wxt-dev/i18n";
import { type Browser, browser } from "wxt/browser";
import { getCurrentTabId } from "@/browser/getCurrentTabId";
import {
  addListener,
  type SpeechDisabled,
  type SpeechEnabled,
  sendMessage,
  sendMessageToTab,
} from "@/ExtensionMessages";

const { t } = createI18n();

export const addContextMenus = () => {
  browser.runtime.onInstalled.addListener(() => {
    browser.contextMenus.create({
      id: "root",
      title: t("extensionName"),
      contexts: ["page", "frame", "selection", "link", "editable", "image"],
    });
    browser.contextMenus.create({
      id: "speech",
      parentId: "root",
      title: t("contextMenu.speech"),
      contexts: ["page", "frame", "selection", "link", "editable", "image"],
      type: "checkbox",
    });
    browser.contextMenus.create({
      id: "separator1",
      parentId: "root",
      type: "separator",
      contexts: ["page", "frame", "selection", "link", "editable", "image"],
    });
    browser.contextMenus.create({
      id: "openTableOfContents",
      parentId: "root",
      title: t("contextMenu.openTableOfContents"),
      contexts: ["page", "frame", "selection", "link", "editable", "image"],
    });
    browser.contextMenus.create({
      id: "openTextSettings",
      parentId: "root",
      title: t("contextMenu.openTextSettings"),
      contexts: ["page", "frame", "selection", "link", "editable", "image"],
    });
    browser.contextMenus.create({
      id: "openSpeechSettings",
      parentId: "root",
      title: t("contextMenu.openSpeechSettings"),
      contexts: ["page", "frame", "selection", "link", "editable", "image"],
    });
  });

  browser.contextMenus.onClicked.addListener((info) => {
    if (info.menuItemId === "openTableOfContents") {
      openTab(info, "tableOfContents");
      return;
    }
    if (info.menuItemId === "openTextSettings") {
      openTab(info, "text");
      return;
    }
    if (info.menuItemId === "openSpeechSettings") {
      openTab(info, "speech");
      return;
    }
    if (info.menuItemId === "speech") {
      toggleSpeech(info.checked);
      return;
    }
  });

  addListener<SpeechEnabled | SpeechDisabled>(
    (message, _sender, _sendResponse) => {
      const { action } = message;
      if (action === "speechEnabled") {
        browser.contextMenus.update("speech", { checked: true });
        return false;
      }
      if (action === "speechDisabled") {
        browser.contextMenus.update("speech", { checked: false });
        return false;
      }
    },
  );
};

const openTab = async (
  info: Browser.contextMenus.OnClickData,
  tab: "tableOfContents" | "text" | "speech",
) => {
  console.log("Open tab:", tab, info);
  if (browser.action) {
    try {
      await browser.storage.local.set({ activeTab: tab });
      await browser.action.openPopup();
      await sendMessage({ action: "selectTab", tab });
    } catch (err) {
      console.error("Failed to send message to popup:", err);
    }
    return;
  }
  if (info.pageUrl?.startsWith("http")) {
    const tabId = await getCurrentTabId();
    if (tabId) {
      sendMessageToTab(tabId, {
        action: "openUserInterface",
        tab,
        frameUrl: info.frameUrl || undefined,
      });
    }
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
