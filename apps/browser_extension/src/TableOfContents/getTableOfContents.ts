import { computeAccessibleName } from "dom-accessibility-api";
import getXPath from "get-xpath";
import { getLandmarkRole } from "@/aria/getLandmarkRole";
import type {
  HeadingEntry,
  LandmarkEntry,
  LandmarkRole,
  TableOfContents,
} from "@/types";
import { isAriaHidden, isInAriaHidden } from "@/utils/isAriaHidden";
import { isHidden } from "@/utils/isHidden";

/**
 * 要素をスキップすべきか判定する
 */
const shouldSkipElement = (element: Element, exclude?: string): boolean =>
  isHidden(element) ||
  isAriaHidden(element) ||
  isInAriaHidden(element) ||
  Boolean(exclude && element.closest(exclude));

/**
 * 親ランドマークのインデックスを探す（再帰的）
 */
const findParentLandmarkIndexRecursive = (
  currentParent: Element | null,
  doc: Document,
  elementMap: Map<Element, number>,
  entries: Array<HeadingEntry | LandmarkEntry>,
): number | undefined => {
  if (!currentParent || currentParent === doc.documentElement) {
    return undefined;
  }

  const parentIndex = elementMap.get(currentParent);
  if (parentIndex !== undefined) {
    const parentEntry = entries[parentIndex];
    if (parentEntry.type === "landmark") {
      return parentIndex;
    }
  }

  return findParentLandmarkIndexRecursive(
    currentParent.parentElement,
    doc,
    elementMap,
    entries,
  );
};

/**
 * 親ランドマークのインデックスを探す
 */
const findParentLandmarkIndex = (
  element: Element,
  doc: Document,
  elementMap: Map<Element, number>,
  entries: Array<HeadingEntry | LandmarkEntry>,
  inheritedParentLandmarkIndex?: number,
): number | undefined =>
  findParentLandmarkIndexRecursive(
    element.parentElement,
    doc,
    elementMap,
    entries,
  ) ?? inheritedParentLandmarkIndex;

/**
 * 親ランドマークの子リストに追加する
 */
const addChildToParentLandmark = (
  parentLandmarkIndex: number | undefined,
  childIndex: number,
  entries: Array<HeadingEntry | LandmarkEntry>,
): void => {
  if (parentLandmarkIndex !== undefined) {
    const parent = entries[parentLandmarkIndex];
    if (parent.type === "landmark") {
      parent.childIndices.push(childIndex);
    }
  }
};

/**
 * iframe要素の親ランドマークを探す（再帰的）
 */
const findIframeParentLandmarkIndexRecursive = (
  currentParent: HTMLElement | null,
  elementMap: Map<Element, number>,
  entries: Array<HeadingEntry | LandmarkEntry>,
): number | undefined => {
  if (!currentParent?.ownerDocument) {
    return undefined;
  }

  const parentIndex = elementMap.get(currentParent);
  if (parentIndex !== undefined) {
    const parentEntry = entries[parentIndex];
    if (parentEntry.type === "landmark") {
      return parentIndex;
    }
  }

  return findIframeParentLandmarkIndexRecursive(
    currentParent.parentElement,
    elementMap,
    entries,
  );
};

/**
 * iframe/frame要素を処理する
 */
const processIframeElement = (
  element: HTMLIFrameElement | HTMLFrameElement,
  xpathPrefix: string[],
  exclude: string | undefined,
  elementMap: Map<Element, number>,
  entries: Array<HeadingEntry | LandmarkEntry>,
  getTableOfContentsFromDocument: (
    doc: Document,
    xpathPrefix: string[],
    exclude?: string,
    parentElementMap?: Map<Element, number>,
    parentEntries?: Array<HeadingEntry | LandmarkEntry>,
    inheritedParentLandmarkIndex?: number,
  ) => void,
): void => {
  try {
    const frameDoc = element.contentDocument;
    if (frameDoc) {
      const frameXPath = getXPath(element);
      const iframeParentLandmarkIndex = findIframeParentLandmarkIndexRecursive(
        element.parentElement,
        elementMap,
        entries,
      );

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
};

/**
 * 見出し要素を処理する
 */
const processHeadingElement = (
  element: Element,
  tagName: string,
  xpaths: string[],
  doc: Document,
  elementMap: Map<Element, number>,
  entries: Array<HeadingEntry | LandmarkEntry>,
  inheritedParentLandmarkIndex?: number,
): void => {
  const text =
    computeAccessibleName(element) || element.textContent?.trim() || "";
  if (!text) return;

  // aria-level属性がある場合はそれを優先、なければタグ名から取得
  const ariaLevel = element.getAttribute("aria-level");
  const level = ariaLevel
    ? Number.parseInt(ariaLevel, 10)
    : /^h[1-6]$/.test(tagName)
      ? Number.parseInt(tagName.substring(1), 10)
      : 2;

  const parentLandmarkIndex = findParentLandmarkIndex(
    element,
    doc,
    elementMap,
    entries,
    inheritedParentLandmarkIndex,
  );

  const entryIndex = entries.length;

  const entry: HeadingEntry = {
    type: "heading",
    level,
    text,
    xpaths,
    index: entryIndex,
    parentLandmarkIndex,
  };

  elementMap.set(element, entryIndex);
  entries.push(entry);

  addChildToParentLandmark(parentLandmarkIndex, entryIndex, entries);
};

/**
 * 親ランドマークを探してnestLevelを計算する（再帰的）
 */
const findParentLandmarkWithNestLevel = (
  currentParent: Element | null,
  doc: Document,
  elementMap: Map<Element, number>,
  entries: Array<HeadingEntry | LandmarkEntry>,
): { parentLandmarkIndex?: number; nestLevel: number } => {
  if (!currentParent || currentParent === doc.documentElement) {
    return { nestLevel: 0 };
  }

  const parentIndex = elementMap.get(currentParent);
  if (parentIndex !== undefined) {
    const parentEntry = entries[parentIndex];
    if (parentEntry.type === "landmark") {
      return {
        parentLandmarkIndex: parentIndex,
        nestLevel: parentEntry.nestLevel + 1,
      };
    }
  }

  return findParentLandmarkWithNestLevel(
    currentParent.parentElement,
    doc,
    elementMap,
    entries,
  );
};

/**
 * ランドマーク要素を処理する
 */
const processLandmarkElement = (
  element: Element,
  tagName: string,
  landmarkRole: LandmarkRole,
  xpaths: string[],
  doc: Document,
  elementMap: Map<Element, number>,
  entries: Array<HeadingEntry | LandmarkEntry>,
  inheritedParentLandmarkIndex?: number,
): void => {
  const label = computeAccessibleName(element).trim();
  if (tagName === "section" && !label) {
    return;
  }

  const { parentLandmarkIndex: foundParentIndex, nestLevel: foundNestLevel } =
    findParentLandmarkWithNestLevel(
      element.parentElement,
      doc,
      elementMap,
      entries,
    );

  const parentLandmarkIndex = foundParentIndex ?? inheritedParentLandmarkIndex;
  const nestLevel =
    foundParentIndex !== undefined
      ? foundNestLevel
      : inheritedParentLandmarkIndex !== undefined
        ? (entries[inheritedParentLandmarkIndex] as LandmarkEntry).nestLevel + 1
        : 0;

  const entryIndex = entries.length;

  const entry: LandmarkEntry = {
    type: "landmark",
    role: landmarkRole,
    label,
    tag: tagName,
    xpaths,
    index: entryIndex,
    childIndices: [],
    nestLevel,
    parentLandmarkIndex,
  };

  elementMap.set(element, entryIndex);
  entries.push(entry);

  addChildToParentLandmark(parentLandmarkIndex, entryIndex, entries);
};

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
    if (shouldSkipElement(element, exclude)) {
      continue;
    }

    // iframe/frameの場合は中身を処理
    if (
      element instanceof HTMLIFrameElement ||
      element instanceof HTMLFrameElement
    ) {
      processIframeElement(
        element,
        xpathPrefix,
        exclude,
        elementMap,
        entries,
        getTableOfContentsFromDocument,
      );
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
      processHeadingElement(
        element,
        tagName,
        xpaths,
        doc,
        elementMap,
        entries,
        inheritedParentLandmarkIndex,
      );
    } else if (landmarkRole) {
      processLandmarkElement(
        element,
        tagName,
        landmarkRole,
        xpaths,
        doc,
        elementMap,
        entries,
        inheritedParentLandmarkIndex,
      );
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
  const topLevelIndices = entries
    .filter((entry) => entry.parentLandmarkIndex === undefined)
    .map((entry) => entry.index);

  return {
    entries,
    topLevelIndices,
  };
};
