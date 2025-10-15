import { computeAccessibleName } from "dom-accessibility-api";
import getXPath from "get-xpath";
import { getLandmarkRole } from "@/aria/getLandmarkRole";
import type { HeadingEntry, LandmarkEntry, TableOfContents } from "@/types";
import { isAriaHidden, isInAriaHidden } from "@/utils/isAriaHidden";
import { isHidden } from "@/utils/isHidden";

/**
 * ドキュメントから目次を取得する（再帰的にiframe/frameも処理）
 */
const getTableOfContentsFromDocument = (
  doc: Document,
  xpathPrefix: string[] = [],
  exclude?: string,
  parentElementMap?: Map<Element, number>,
  parentEntries?: Array<HeadingEntry | LandmarkEntry>,
  inheritedParentLandmarkIndex?: number,
): {
  entries: Array<HeadingEntry | LandmarkEntry>;
  elementMap: Map<Element, number>;
} => {
  // 親から渡された場合はそれを使用、なければ新規作成
  const entries = parentEntries || [];
  const elementMap = parentElementMap || new Map<Element, number>();

  // 見出しとランドマークのセレクタ
  const headingSelector = "h1, h2, h3, h4, h5, h6, [role='heading']";
  const landmarkSelector = [
    "header",
    "nav",
    "main",
    "aside",
    "footer",
    "section",
    '[role="banner"]',
    '[role="navigation"]',
    '[role="main"]',
    '[role="complementary"]',
    '[role="contentinfo"]',
    '[role="search"]',
    '[role="form"]',
    '[role="region"]',
  ].join(",");

  // iframe/frameも含めてすべての要素を取得
  const allElements = doc.querySelectorAll(
    `${headingSelector}, ${landmarkSelector}, iframe, frame`,
  );

  for (const element of allElements) {
    // 除外条件チェック
    if (isHidden(element) || isAriaHidden(element) || isInAriaHidden(element)) {
      continue;
    }
    if (exclude && element.closest(exclude)) {
      continue;
    }

    // iframe/frameの場合は中身を処理
    if (
      element instanceof HTMLIFrameElement ||
      element instanceof HTMLFrameElement
    ) {
      try {
        const frameDoc = element.contentDocument;
        if (frameDoc) {
          const frameXPath = getXPath(element);

          // iframe要素自体の親ランドマークを探す
          let iframeParentLandmarkIndex: number | undefined;
          let currentParent = element.parentElement;
          while (currentParent?.ownerDocument) {
            const parentIndex = elementMap.get(currentParent);
            if (parentIndex !== undefined) {
              const parentEntry = entries[parentIndex];
              if (parentEntry.type === "landmark") {
                iframeParentLandmarkIndex = parentIndex;
                break;
              }
            }
            currentParent = currentParent.parentElement;
          }

          // 再帰的に処理（同じentriesとelementMapを渡し、iframe要素の親ランドマークも渡す）
          getTableOfContentsFromDocument(
            frameDoc,
            [...xpathPrefix, frameXPath],
            exclude,
            elementMap,
            entries,
            iframeParentLandmarkIndex,
          );
        }
      } catch (_e) {
        // iframe/frameへのアクセスが許可されていない場合はスキップ
      }
      continue;
    }

    const xpath = getXPath(element);
    const xpaths = [...xpathPrefix, xpath];
    const tagName = element.tagName.toLowerCase();

    // 見出しかランドマークか判定
    const isHeading =
      /^h[1-6]$/.test(tagName) || element.getAttribute("role") === "heading";
    const landmarkRole = isHeading
      ? null
      : getLandmarkRole(element as HTMLElement);

    if (isHeading) {
      // 見出し
      const text = element.textContent?.trim() || "";
      if (!text) continue;

      const level = /^h[1-6]$/.test(tagName)
        ? Number.parseInt(tagName.substring(1), 10)
        : Number.parseInt(element.getAttribute("aria-level") || "2", 10);

      // 親ランドマークを探す
      let parentLandmarkIndex: number | undefined;
      let currentParent = element.parentElement;
      while (currentParent && currentParent !== doc.documentElement) {
        const parentIndex = elementMap.get(currentParent);
        if (parentIndex !== undefined) {
          const parentEntry = entries[parentIndex];
          if (parentEntry.type === "landmark") {
            parentLandmarkIndex = parentIndex;
            break;
          }
        }
        currentParent = currentParent.parentElement;
      }
      // 親ドキュメントから継承された親ランドマークがある場合
      if (
        parentLandmarkIndex === undefined &&
        inheritedParentLandmarkIndex !== undefined
      ) {
        parentLandmarkIndex = inheritedParentLandmarkIndex;
      }

      const entry: HeadingEntry = {
        type: "heading",
        level,
        text,
        xpaths,
        parentLandmarkIndex,
      };

      elementMap.set(element, entries.length);
      entries.push(entry);

      // 親ランドマークの子リストに追加
      if (parentLandmarkIndex !== undefined) {
        const parent = entries[parentLandmarkIndex];
        if (parent.type === "landmark") {
          parent.childIndices.push(entries.length - 1);
        }
      }
    } else if (landmarkRole) {
      // ランドマーク
      const label = computeAccessibleName(element).trim();
      if (tagName === "section" && !label) {
        continue;
      }

      // 親ランドマークを探す
      let parentLandmarkIndex: number | undefined;
      let nestLevel = 0;
      let currentParent = element.parentElement;
      while (currentParent && currentParent !== doc.documentElement) {
        const parentIndex = elementMap.get(currentParent);
        if (parentIndex !== undefined) {
          const parentEntry = entries[parentIndex];
          if (parentEntry.type === "landmark") {
            parentLandmarkIndex = parentIndex;
            nestLevel = parentEntry.nestLevel + 1;
            break;
          }
        }
        currentParent = currentParent.parentElement;
      }
      // 親ドキュメントから継承された親ランドマークがある場合
      if (
        parentLandmarkIndex === undefined &&
        inheritedParentLandmarkIndex !== undefined
      ) {
        parentLandmarkIndex = inheritedParentLandmarkIndex;
        const inheritedParent = entries[inheritedParentLandmarkIndex];
        if (inheritedParent.type === "landmark") {
          nestLevel = inheritedParent.nestLevel + 1;
        }
      }

      const entry: LandmarkEntry = {
        type: "landmark",
        role: landmarkRole,
        label,
        tag: tagName,
        xpaths,
        childIndices: [],
        nestLevel,
        parentLandmarkIndex,
      };

      elementMap.set(element, entries.length);
      entries.push(entry);

      // 親ランドマークの子リストに追加
      if (parentLandmarkIndex !== undefined) {
        const parent = entries[parentLandmarkIndex];
        if (parent.type === "landmark") {
          parent.childIndices.push(entries.length - 1);
        }
      }
    }
  }

  return { entries, elementMap };
};

/**
 * ページから目次データを取得する
 */
export const getTableOfContents = (options?: {
  exclude?: string;
}): TableOfContents => {
  const { entries } = getTableOfContentsFromDocument(
    document,
    [],
    options?.exclude,
  );

  // トップレベルのエントリ（親がないもの）を抽出
  const topLevelIndices: number[] = [];
  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    if (entry.type === "heading" && entry.parentLandmarkIndex === undefined) {
      topLevelIndices.push(i);
    } else if (
      entry.type === "landmark" &&
      entry.parentLandmarkIndex === undefined
    ) {
      topLevelIndices.push(i);
    }
  }

  return {
    entries,
    topLevelIndices,
  };
};
