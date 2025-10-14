import type {
  Heading,
  HeadingEntry,
  Landmark,
  LandmarkEntry,
  TableOfContents,
} from "@/types";
import { getHeadings } from "./getHeadings";
import { getLandmarks } from "./getLandmarks";

/**
 * XPathから要素を取得する
 */
const getElementByXPath = (xpaths: string[]): Element | null => {
  let currentDoc: Document | null = document;
  let currentElement: Element | null = null;

  for (const xpath of xpaths) {
    if (!currentDoc) return null;

    const result = currentDoc.evaluate(
      xpath,
      currentDoc,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null,
    );
    currentElement = result.singleNodeValue as Element | null;

    if (!currentElement) return null;

    // iframe/frameの場合は次のdocumentに移動
    if (
      currentElement instanceof HTMLIFrameElement ||
      currentElement instanceof HTMLFrameElement
    ) {
      currentDoc = currentElement.contentDocument;
    } else if (xpaths[xpaths.length - 1] !== xpath) {
      // まだXPathが残っているのに要素がiframe/frameでない場合はエラー
      return null;
    }
  }

  return currentElement;
};

/**
 * 要素が別の要素に含まれているかを判定
 */
const isElementInContainer = (
  elementXPaths: string[],
  containerXPaths: string[],
): boolean => {
  const element = getElementByXPath(elementXPaths);
  const container = getElementByXPath(containerXPaths);

  if (!element || !container) return false;
  if (element === container) return false;

  return container.contains(element);
};

/**
 * 見出しまたはランドマークの親ランドマークを見つける
 */
const findParentLandmark = (
  elementXPaths: string[],
  landmarks: LandmarkEntry[],
): number | undefined => {
  // より深い（より具体的な）ランドマークを優先
  let deepestParent: { index: number; depth: number } | undefined;

  for (let i = 0; i < landmarks.length; i++) {
    if (isElementInContainer(elementXPaths, landmarks[i].xpaths)) {
      const depth = landmarks[i].xpaths.join("/").length;
      if (!deepestParent || depth > deepestParent.depth) {
        deepestParent = { index: i, depth };
      }
    }
  }

  return deepestParent?.index;
};

/**
 * 2つの要素のDOM順序を比較する（マージソート用）
 */
const compareElementPosition = (
  xpathsA: string[],
  xpathsB: string[],
): number => {
  const elementA = getElementByXPath(xpathsA);
  const elementB = getElementByXPath(xpathsB);

  if (!elementA || !elementB) {
    return 0;
  }

  if (elementA === elementB) return 0;

  const position = elementA.compareDocumentPosition(elementB);

  if (position & Node.DOCUMENT_POSITION_FOLLOWING) {
    return -1; // A が B より前
  }
  if (position & Node.DOCUMENT_POSITION_PRECEDING) {
    return 1; // A が B より後
  }

  // 包含関係の場合、親が先
  if (position & Node.DOCUMENT_POSITION_CONTAINS) {
    return -1;
  }
  if (position & Node.DOCUMENT_POSITION_CONTAINED_BY) {
    return 1;
  }

  return 0;
};

/**
 * ページから目次データを取得する
 */
export const getTableOfContents = (options?: {
  exclude?: string;
}): TableOfContents => {
  const headings: Heading[] = getHeadings(options);
  const landmarks: Landmark[] = getLandmarks(options);

  // ランドマークエントリを作成
  const landmarkEntries: LandmarkEntry[] = landmarks.map((landmark) => ({
    type: "landmark" as const,
    role: landmark.role,
    label: landmark.label,
    tag: landmark.tag,
    xpaths: landmark.xpaths,
    childIndices: [],
    nestLevel: 0,
  }));

  // ランドマークの親子関係を設定
  for (let i = 0; i < landmarkEntries.length; i++) {
    const parentIndex = findParentLandmark(
      landmarkEntries[i].xpaths,
      landmarkEntries.slice(0, i),
    );
    if (parentIndex !== undefined) {
      landmarkEntries[i].parentLandmarkIndex = parentIndex;
      const parent = landmarkEntries[parentIndex];
      landmarkEntries[i].nestLevel = parent.nestLevel + 1;
    }
  }

  // 見出しエントリを作成
  const headingEntries: HeadingEntry[] = headings.map((heading) => {
    const parentIndex = findParentLandmark(heading.xpaths, landmarkEntries);
    return {
      type: "heading" as const,
      level: heading.level,
      text: heading.text,
      xpaths: heading.xpaths,
      parentLandmarkIndex: parentIndex,
    };
  });

  // 見出しとランドマークをマージしてDOM順にソート
  type EntryWithType =
    | { type: "heading"; entry: HeadingEntry; originalIndex: number }
    | { type: "landmark"; entry: LandmarkEntry; originalIndex: number };

  const allEntries: EntryWithType[] = [
    ...landmarkEntries.map((entry, index) => ({
      type: "landmark" as const,
      entry,
      originalIndex: index,
    })),
    ...headingEntries.map((entry, index) => ({
      type: "heading" as const,
      entry,
      originalIndex: index,
    })),
  ];

  // DOM順にソート
  allEntries.sort((a, b) =>
    compareElementPosition(a.entry.xpaths, b.entry.xpaths),
  );

  // 最終的なエントリリストとトップレベルインデックスを構築
  const entries: Array<HeadingEntry | LandmarkEntry> = [];
  const topLevelIndices: number[] = [];
  const landmarkIndexMap = new Map<number, number>();

  for (const item of allEntries) {
    const newIndex = entries.length;

    if (item.type === "landmark") {
      landmarkIndexMap.set(item.originalIndex, newIndex);
      entries.push(item.entry);

      if (item.entry.parentLandmarkIndex === undefined) {
        topLevelIndices.push(newIndex);
      }
    } else {
      // 見出しの親ランドマークインデックスを新しいインデックスに変換
      const entry = { ...item.entry };
      if (entry.parentLandmarkIndex !== undefined) {
        entry.parentLandmarkIndex = landmarkIndexMap.get(
          entry.parentLandmarkIndex,
        );
      }
      entries.push(entry);

      if (entry.parentLandmarkIndex === undefined) {
        topLevelIndices.push(newIndex);
      }
    }
  }

  // ランドマークの親子インデックスを更新
  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];

    if (entry.type === "landmark" && entry.parentLandmarkIndex !== undefined) {
      const originalParentIndex = landmarkEntries.findIndex(
        (le) => le.xpaths.join("/") === entry.xpaths.join("/"),
      );
      if (originalParentIndex !== -1) {
        const parentEntry = landmarkEntries[originalParentIndex];
        if (parentEntry.parentLandmarkIndex !== undefined) {
          entry.parentLandmarkIndex = landmarkIndexMap.get(
            parentEntry.parentLandmarkIndex,
          );
        }
      }
    }

    // 子インデックスを設定
    if (entry.parentLandmarkIndex !== undefined) {
      const parent = entries[entry.parentLandmarkIndex];
      if (parent.type === "landmark") {
        parent.childIndices.push(i);
      }
    }
  }

  return {
    entries,
    topLevelIndices,
  };
};
