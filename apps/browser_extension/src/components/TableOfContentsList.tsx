import { createI18n } from "@wxt-dev/i18n";
import { useId, useMemo } from "react";
import type { TableOfContents, TableOfContentsEntry } from "@/types";
import { HeadingLevelSlider } from "./HeadingLevelSlider";

const { t } = createI18n();

function TableOfContentsItem({
  entry,
  onScrollToElement,
}: {
  entry: TableOfContentsEntry;
  onScrollToElement: (xpaths: string[]) => void;
}) {
  if (entry.type === "heading") {
    // 見出しのインデントは親ランドマークのnestLevel + 1
    const indentLevel = entry.parentLandmarkIndex !== undefined ? 1 : 0;

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
            flex items-center py-2 space-x-2"
          style={{
            paddingLeft: `${0.5 + indentLevel * 1.5}rem`,
            paddingRight: "0.5rem",
          }}
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

  // ランドマーク
  const indentLevel = entry.nestLevel;

  return (
    <li className="flex items-stretch flex-col">
      <button
        type="button"
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
    </li>
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

  // レベルフィルタを適用したエントリリストを作成
  const visibleEntries = useMemo(() => {
    if (!tableOfContents) return [];

    return tableOfContents.entries.filter((entry) => {
      // 見出しの場合はレベルフィルタを適用
      if (entry.type === "heading" && levelFilter !== 7) {
        return entry.level <= levelFilter;
      }
      // ランドマークは常に表示
      return true;
    });
  }, [tableOfContents, levelFilter]);

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
      <HeadingLevelSlider
        value={levelFilter}
        onChange={(value) => onLevelFilterChange?.(value)}
      />
      {loading ? (
        <div className="h-32 flex justify-center items-center">
          <p className="text-sm text-stone-500 dark:text-stone-400">
            {t("loading")}
          </p>
        </div>
      ) : hasVisibleEntries ? (
        <ul className="space-y-1 p-1 min-h-32">
          {visibleEntries.map((entry, index) => (
            <TableOfContentsItem
              key={`${entry.type}-${index}-${entry.xpaths.join("/")}`}
              entry={entry}
              onScrollToElement={onScrollToElement}
            />
          ))}
        </ul>
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
