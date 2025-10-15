import type { Landmark } from "./landmarks";

/**
 * 目次のエントリ基底型
 */
export type TableOfContentsEntryBase = {
  /** エントリの種類 */
  type: "heading" | "landmark";
  /** XPathの配列 */
  xpaths: string[];
  /** エントリのインデックス */
  index: number;
};

/**
 * 見出しエントリ
 */
export type HeadingEntry = TableOfContentsEntryBase & {
  type: "heading";
  /** 見出しレベル (1-6) */
  level: number;
  /** 見出しテキスト */
  text: string;
  /** 親ランドマークのインデックス */
  parentLandmarkIndex?: number;
};

/**
 * ランドマークエントリ
 */
export type LandmarkEntry = TableOfContentsEntryBase & {
  type: "landmark";
  /** ランドマークロール */
  role: Landmark["role"];
  /** ランドマークラベル */
  label?: string;
  /** タグ名 */
  tag: string;
  /** 子要素のインデックス（見出しとランドマーク） */
  childIndices: number[];
  /** 親ランドマークのインデックス */
  parentLandmarkIndex?: number;
  /** ネストレベル (0から始まる) */
  nestLevel: number;
};

/**
 * 目次エントリ（見出しまたはランドマーク）
 */
export type TableOfContentsEntry = HeadingEntry | LandmarkEntry;

/**
 * 目次データ構造
 */
export type TableOfContents = {
  /** 全エントリのフラットな配列 */
  entries: TableOfContentsEntry[];
  /** トップレベルのエントリインデックス */
  topLevelIndices: number[];
};
