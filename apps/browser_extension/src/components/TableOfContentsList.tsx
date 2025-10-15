import { createI18n } from "@wxt-dev/i18n";
import { useId, useMemo, useState } from "react";
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
          flex items-center py-2 space-x-2 px-2"
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
    <>
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
          py-2 font-semibold"
        style={{
          paddingLeft: `${0.5 + indentLevel * 1.5}rem`,
          paddingRight: "0.5rem",
        }}
      >
        <span className="text-base">
          {entry.label || t(`landmarkRoles.${entry.role}`)}
        </span>
        {entry.label && (
          <span className="text-sm font-normal">
            {" "}
            ({t(`landmarkRoles.${entry.role}`)})
          </span>
        )}
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
    </>
  );
}

export function TableOfContentsList({
  onScrollToElement,
  onLevelFilterChange,
  loading = false,
  levelFilter = 7,
  tableOfContents,
}: {
  onScrollToElement: (xpaths: string[]) => void;
  onLevelFilterChange?: (level: number) => void;
  loading?: boolean;
  levelFilter?: number;
  tableOfContents: TableOfContents | null;
}) {
  const id = useId();
  const [displayMode, setDisplayMode] = useState<DisplayMode>("all");

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
      <div className="flex items-center gap-2 mb-2 px-2">
        <div className="flex-1">
          <HeadingLevelSlider
            value={levelFilter}
            onChange={(value) => onLevelFilterChange?.(value)}
          />
        </div>
        <div className="flex items-center gap-1">
          <label
            htmlFor={`${id}-display-mode`}
            className="text-sm text-stone-700 dark:text-stone-300"
          >
            {t("displayMode")}:
          </label>
          <select
            id={`${id}-display-mode`}
            value={displayMode}
            onChange={(e) => setDisplayMode(e.target.value as DisplayMode)}
            className="text-sm px-2 py-1 rounded border border-stone-300 dark:border-stone-600
              bg-white dark:bg-stone-800
              text-stone-800 dark:text-stone-200
              focus:outline-none focus:ring-2 focus:ring-rose-400"
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
      </div>
      {loading ? (
        <div className="h-32 flex justify-center items-center">
          <p className="text-sm text-stone-500 dark:text-stone-400">
            {t("loading")}
          </p>
        </div>
      ) : hasVisibleEntries && tableOfContents ? (
        <div className="space-y-1 p-1 min-h-32">
          {visibleEntries.map((entry) =>
            entry.type === "heading" ? (
              <ul key={`top-heading-${entry.index}`} className="space-y-1">
                <HeadingItem
                  entry={entry}
                  onScrollToElement={onScrollToElement}
                />
              </ul>
            ) : (
              <div key={`top-landmark-${entry.index}`} className="space-y-1">
                <LandmarkGroup
                  entry={entry}
                  tableOfContents={tableOfContents}
                  onScrollToElement={onScrollToElement}
                  displayMode={displayMode}
                  levelFilter={levelFilter}
                  groupId={`${id}-landmark-${entry.index}`}
                />
              </div>
            ),
          )}
        </div>
      ) : (
        <div className="h-32 flex justify-center items-center">
          <p className="text-sm text-stone-500 dark:text-stone-400">
            {!tableOfContents || tableOfContents.entries.length === 0
              ? t("noTableOfContents")
              : "選択したレベルの見出しがありません"}
          </p>
        </div>
      )}
    </section>
  );
}
