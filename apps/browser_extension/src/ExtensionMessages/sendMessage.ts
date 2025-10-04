import { browser } from "wxt/browser";
import type { ExtensionMessage, ResponseForMessage } from "./ExtensionMessage";

export const sendMessage = async <M extends ExtensionMessage>(
  message: M,
): Promise<ResponseForMessage<M>> => {
  try {
    return await browser.runtime.sendMessage(message);
  } catch (error) {
    console.error("Failed to send message:", error);
    throw error;
  }
};

export const sendMessageToTab = async <M extends ExtensionMessage>(
  tabId: number,
  message: M,
): Promise<ResponseForMessage<M>> => {
  try {
    return await browser.tabs.sendMessage(tabId, message);
  } catch (error) {
    console.error("Failed to send message to tab:", error);
    throw error;
  }
};
