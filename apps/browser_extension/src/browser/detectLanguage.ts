import { browser } from "wxt/browser";

export const detectLanguage = async () => {
  const lang = await browser.i18n.getUILanguage();
  const firstLang = lang.split("-")[0];
  console.log("Detected language:", lang, firstLang);
  return firstLang === "ja" ? "ja" : "en";
};

export const setLanguageToDocument = async (doc: Document) => {
  doc.documentElement.lang = await detectLanguage();
};
