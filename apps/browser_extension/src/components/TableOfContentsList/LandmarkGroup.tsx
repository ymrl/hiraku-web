import { createI18n } from "@wxt-dev/i18n";
import type { DisplayMode } from "@/storage";
import type { LandmarkEntry, TableOfContents } from "@/types";
import { HeadingItem } from "./HeadingItem";

const { t } = createI18n();

/**
 * ランドマークグループ（ランドマーク + その子要素）
 */
export function LandmarkGroup({
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
          flex items-center py-1 px-2"
      >
        <span>
          <span className="text-sm">
            {entry.label || t(`landmarkRoles.${entry.role}`)}
          </span>
          {entry.label && (
            <span className="text-xs font-normal">
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
            paddingLeft: `${(indentLevel + 1) * 1}rem`,
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
