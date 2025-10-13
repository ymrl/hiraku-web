import { browser } from "wxt/browser";
import { addListener } from "@/ExtensionMessages";
import { loadHostTextStyle } from "@/TextStyle";

export const addMessageListeners = () => {
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
    if (action === "getUserInterfaceSettings") {
      try {
        browser.storage.sync.get("userInterfaceSettings").then((result) => {
          sendResponse({
            action,
            settings: {
              showButtonOnPage: false,
              ...result.userInterfaceSettings,
            },
          });
        });
        return true;
      } catch (err) {
        console.error("Failed to get UI settings:", err);
        sendResponse({ action, settings: { showButtonOnPage: false } });
      }
    }
  });
};
