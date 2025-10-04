import { browser } from "wxt/browser";
import type { ExtensionMessage, ResponseForMessage } from "./ExtensionMessage";

export const sendMessage = async <M extends ExtensionMessage>(
  message: M,
): Promise<ResponseForMessage<M>> => {
  return await browser.runtime.sendMessage(message);
};

export const sendMessageToTab = async <M extends ExtensionMessage>(
  tabId: number,
  message: M,
): Promise<ResponseForMessage<M>> => {
  return await browser.tabs.sendMessage(tabId, message);
};
