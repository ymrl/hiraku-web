export interface Translations {
  en: Record<string, string>;
  ja: Record<string, string>;
}

const translations: Translations = {
  en: {
    title: "Page Structure",
    headings: "Headings",
    landmarks: "Landmarks",
    noHeadings: "No headings found",
    noLandmarks: "No landmarks found",
    loading: "Loading...",
    error: "Error loading page structure",
    level: "Level",
    role: "Role",
    label: "Label",
    tag: "Tag",
  },
  ja: {
    title: "ページ構造",
    headings: "見出し",
    landmarks: "ランドマーク",
    noHeadings: "見出しが見つかりません",
    noLandmarks: "ランドマークが見つかりません",
    loading: "読み込み中...",
    error: "ページ構造の読み込みエラー",
    level: "レベル",
    role: "ロール",
    label: "ラベル",
    tag: "タグ",
  },
};

export type Language = "en" | "ja";

export function detectLanguage(): Language {
  const browserLang = navigator.language.toLowerCase();
  return browserLang.startsWith("ja") ? "ja" : "en";
}

export function useTranslation(language: Language) {
  return (key: string): string => {
    return translations[language][key] || key;
  };
}

export { translations };
