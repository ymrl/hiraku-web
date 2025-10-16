import { browser } from "wxt/browser";

export type TocListState = {
  levelFilter: number;
  displayMode: "all" | "landmarksOnly" | "headingsOnly";
};

export const saveTocListState = async (state: TocListState) => {
  try {
    await browser.storage.local.set({
      tocPanelState: state,
    });
  } catch (err) {
    console.error("Failed to save TOC panel state:", err);
  }
};

export const loadTocListState = async (): Promise<TocListState> => {
  try {
    const result = await browser.storage.local.get("tocPanelState");
    return {
      levelFilter: result.tocPanelState?.levelFilter ?? 7,
      displayMode: result.tocPanelState?.displayMode ?? "all",
    };
  } catch (err) {
    console.error("Failed to load TOC panel state:", err);
    return {
      levelFilter: 7,
      displayMode: "all",
    };
  }
};

export type ExtensionTab = "tableOfContents" | "text" | "speech";

export const saveActiveTab = async (tab: ExtensionTab) => {
  try {
    await browser.storage.local.set({ activeTab: tab });
  } catch (err) {
    console.error("Failed to save active tab:", err);
  }
};

export const loadActiveTab = async (): Promise<ExtensionTab> => {
  try {
    const result = await browser.storage.local.get("activeTab");
    return result.activeTab ?? "tableOfContents";
  } catch (err) {
    console.error("Failed to load active tab:", err);
    return "tableOfContents";
  }
};
