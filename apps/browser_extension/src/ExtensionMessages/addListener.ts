import { type Browser, browser } from "wxt/browser";
import type { ExtensionMessage, ResponseForMessage } from "./ExtensionMessage";

export type MessageListener<M extends ExtensionMessage> = (
  message: M,
  sender: Browser.runtime.MessageSender,
  sendResponse: (response: ResponseForMessage<M>) => void,
) => boolean | undefined;

export const addListener = <M extends ExtensionMessage>(
  callback: MessageListener<M>,
) => {
  browser.runtime.onMessage.addListener(callback);
};

export const removeListener = <M extends ExtensionMessage>(
  callback: MessageListener<M>,
) => {
  browser.runtime.onMessage.removeListener(callback);
};
