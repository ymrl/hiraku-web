import { createI18n } from "@wxt-dev/i18n";
import { useId, useMemo, useRef, useState } from "react";
import {
  loadTocListState,
  saveTocListState,
  type TocListState,
} from "@/storage";
import type {
  LandmarkEntry,
  TableOfContents,
  TableOfContentsEntry,
} from "@/types";
import { HeadingLevelSlider } from "./HeadingLevelSlider";

const { t } = createI18n();

type DisplayMode = "all" | "landmarksOnly" | "headingsOnly";

/**
 * 見出しアイテム
 */
function HeadingItem({
  entry,
  onScrollToElement,
}: {
  entry: TableOfContentsEntry;
  onScrollToElement: (xpaths: string[]) => void;
}) {
  if (entry.type !== "heading") return null;

  return (
    <li className="flex items-stretch flex-col">
      <button
        type="button"
        onClick={() => onScrollToElement(entry.xpaths)}
        className="text-left text-sm text-stone-800 dark:text-stone-200
          hover:text-rose-800 dark:hover:text-rose-100
          hover:bg-rose-50
          dark:hover:bg-stone-800 transition-colors
          rounded-lg border-2 border-transparent
          hover:border-rose-300 dark:hover:border-rose-400
          cursor-pointer
          flex items-center py-2 px-2 gap-2"
      >
        <span
          className="flex-shrink-0
            inline-flex items-center justify-center
            w-6 h-6
            text-sm font-bold
            text-stone-500 dark:text-stone-300
            border border-rose-200 dark:border-rose-300 rounded"
        >
          {entry.level}
        </span>
        <span className="text-left text-base">{entry.text}</span>
      </button>
    </li>
  );
}

/**
 * ランドマークグループ（ランドマーク + その子要素）
 */
function LandmarkGroup({
  entry,
  tableOfContents,
  onScrollToElement,
  displayMode,
  levelFilter,
  groupId,
}: {
  entry: LandmarkEntry;
  tableOfContents: TableOfContents;
  onScrollToElement: (xpaths: string[]) => void;
  displayMode: DisplayMode;
  levelFilter: number;
  groupId: string;
}) {
  const indentLevel = entry.nestLevel;

  // このランドマークの子要素を取得
  const childEntries = entry.childIndices
    .map((index) => tableOfContents.entries[index])
    .filter((child) => {
      if (displayMode === "landmarksOnly" && child.type === "heading")
        return false;
      if (displayMode === "headingsOnly" && child.type === "landmark")
        return false;
      if (child.type === "heading" && levelFilter !== 7) {
        return child.level <= levelFilter;
      }
      return true;
    });

  return (
    <li className="flex items-stretch flex-col">
      <button
        type="button"
        id={groupId}
        onClick={() => onScrollToElement(entry.xpaths)}
        className="text-left text-sm text-stone-700 dark:text-stone-300
          hover:text-rose-800 dark:hover:text-rose-100
          hover:bg-rose-50
          dark:hover:bg-stone-800 transition-colors
          rounded-lg border-2 border-transparent
          hover:border-rose-300 dark:hover:border-rose-400
          cursor-pointer
          flex items-center py-2 px-2"
      >
        <span>
          <span className="text-base">
            {entry.label || t(`landmarkRoles.${entry.role}`)}
          </span>
          {entry.label && (
            <span className="text-sm font-normal">
              {" "}
              ({t(`landmarkRoles.${entry.role}`)})
            </span>
          )}
        </span>
      </button>
      {childEntries.length > 0 && (
        <ul
          className="space-y-1"
          aria-labelledby={groupId}
          style={{
            paddingLeft: `${0.5 + (indentLevel + 1) * 1.5}rem`,
          }}
        >
          {childEntries.map((child) =>
            child.type === "heading" ? (
              <HeadingItem
                key={`heading-${child.index}`}
                entry={child}
                onScrollToElement={onScrollToElement}
              />
            ) : (
              <LandmarkGroup
                key={`landmark-${child.index}`}
                entry={child}
                tableOfContents={tableOfContents}
                onScrollToElement={onScrollToElement}
                displayMode={displayMode}
                levelFilter={levelFilter}
                groupId={`${groupId}-child-${child.index}`}
              />
            ),
          )}
        </ul>
      )}
    </li>
  );
}

export function TableOfContentsList({
  onScrollToElement,
  loading = false,
  tableOfContents,
}: {
  onScrollToElement: (xpaths: string[]) => void;
  loading?: boolean;
  tableOfContents: TableOfContents | null;
}) {
  const id = useId();
  const [tocListState, setTocListState] = useState<TocListState>({
    levelFilter: 7,
    displayMode: "all",
  });
  const { levelFilter, displayMode } = tocListState;
  const loadedRef = useRef(false);
  if (!loadedRef.current && !loading) {
    loadedRef.current = true;
    (async () => {
      const state = await loadTocListState();
      setTocListState(state);
    })();
  }

  // 表示モードとフィルタを適用したエントリ
  const visibleEntries = useMemo(() => {
    if (!tableOfContents) return [];

    // 見出しのみモードの場合は、すべての見出しを表示
    if (displayMode === "headingsOnly") {
      return tableOfContents.entries.filter((entry) => {
        if (entry.type !== "heading") return false;
        if (levelFilter !== 7) {
          return entry.level <= levelFilter;
        }
        return true;
      });
    }

    // ランドマークのみモード、または全て表示モードの場合はトップレベルのみ
    return tableOfContents.topLevelIndices
      .map((index) => tableOfContents.entries[index])
      .filter((entry) => {
        if (displayMode === "landmarksOnly" && entry.type === "heading")
          return false;
        if (entry.type === "heading" && levelFilter !== 7) {
          return entry.level <= levelFilter;
        }
        return true;
      });
  }, [tableOfContents, displayMode, levelFilter]);

  const hasVisibleEntries = visibleEntries.length > 0;

  return (
    <section
      className="flex flex-col"
      role="tabpanel"
      aria-labelledby={`${id}-heading`}
    >
      <h2 className="sr-only" id={`${id}-heading`}>
        {t("tableOfContents")}
      </h2>
      <div
        className="flex items-center gap-4 px-3 py-2 sticky top-0 left-0 bg-stone-100 dark:bg-stone-800 border-b border-stone-200 dark:border-stone-700
      "
      >
        <div>
          <label htmlFor={`${id}-display-mode`} className="sr-only">
            {t("displayMode")}:
          </label>
          <select
            id={`${id}-display-mode`}
            value={displayMode}
            onChange={(e) => {
              const { value } = e.target;
              if (
                value === "all" ||
                value === "landmarksOnly" ||
                value === "headingsOnly"
              ) {
                const newState = {
                  ...tocListState,
                  displayMode: value,
                } as const;
                setTocListState(newState);
                saveTocListState(newState);
              }
            }}
            className="text-sm pl-0.5 pr-0 py-1 w-28 h-8 rounded border border-stone-300 dark:border-stone-600
              bg-white dark:bg-stone-800
              text-stone-800 dark:text-stone-200"
          >
            <option value="all">{t("displayModes.all")}</option>
            <option value="landmarksOnly">
              {t("displayModes.landmarksOnly")}
            </option>
            <option value="headingsOnly">
              {t("displayModes.headingsOnly")}
            </option>
          </select>
        </div>
        <div className="flex-1">
          <HeadingLevelSlider
            value={levelFilter}
            onChange={(value) => {
              const newState = { ...tocListState, levelFilter: value };
              setTocListState(newState);
              saveTocListState(newState);
            }}
            disabled={displayMode === "landmarksOnly"}
          />
        </div>
      </div>
      {loading ? (
        <div className="h-32 flex justify-center items-center">
          <p className="text-sm text-stone-500 dark:text-stone-400">
            {t("loading")}
          </p>
        </div>
      ) : hasVisibleEntries && tableOfContents ? (
        <ul className="p-1 space-y-1 min-h-32">
          {visibleEntries.map((entry) =>
            entry.type === "heading" ? (
              <HeadingItem
                key={`top-heading-${entry.index}`}
                entry={entry}
                onScrollToElement={onScrollToElement}
              />
            ) : (
              <LandmarkGroup
                key={`top-landmark-${entry.index}`}
                entry={entry}
                tableOfContents={tableOfContents}
                onScrollToElement={onScrollToElement}
                displayMode={displayMode}
                levelFilter={levelFilter}
                groupId={`${id}-landmark-${entry.index}`}
              />
            ),
          )}
        </ul>
      ) : (
        <div className="h-32 flex justify-center items-center">
          <p className="text-sm text-stone-500 dark:text-stone-400">
            {!tableOfContents || tableOfContents.entries.length === 0
              ? t("noTableOfContents")
              : t("noLevelHeadings")}
          </p>
        </div>
      )}
    </section>
  );
}
