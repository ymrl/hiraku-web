import { createI18n } from "@wxt-dev/i18n";
import { useId, useMemo } from "react";
import type { Heading } from "@/types";
import { HeadingLevelSlider } from "./HeadingLevelSlider";

const { t } = createI18n();

export function HeadingsList({
  onScrollToElement,
  onLevelFilterChange,
  loading = false,
  levelFilter = 7,
  headings,
}: {
  onScrollToElement: (xpaths: string[]) => void;
  onLevelFilterChange?: (level: number) => void;
  loading?: boolean;
  levelFilter?: number;
  headings: Heading[];
}) {
  const filteredHeadings = useMemo(() => {
    if (levelFilter === 7) return headings;
    return headings.filter((heading) => heading.level <= levelFilter);
  }, [headings, levelFilter]);

  const id = useId();
  return (
    <section
      className="flex flex-col"
      role="tabpanel"
      aria-labelledby={`${id}-heading`}
    >
      <h2 className="sr-only" id={`${id}-heading`}>
        {t("headings")}
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
      ) : filteredHeadings.length ? (
        <ul className="space-y-1 p-1 min-h-32">
          {filteredHeadings.map((heading, index) => (
            <li
              key={`${index}-${heading}`}
              className="flex items-stretch flex-col"
            >
              <button
                type="button"
                onClick={() => onScrollToElement(heading.xpaths)}
                className="text-left text-sm text-stone-800 dark:text-stone-200
                    hover:text-rose-800 dark:hover:text-rose-100
                    hover:bg-rose-50
                    dark:hover:bg-stone-800 transition-colors
                    rounded-lg border-2 border-transparent
                    hover:border-rose-300 dark:hover:border-rose-400
                    cursor-pointer
                    flex items-center py-2 px-2 space-x-2"
              >
                <span
                  className="flex-shrink-0
                    inline-flex items-center justify-center
                    w-6 h-6
                    text-sm font-bold
                    text-stone-500 dark:text-stone-300
                    border border-rose-200 dark:border-rose-300 rounded"
                >
                  {heading.level}
                </span>
                <span className="text-left text-base">{heading.text}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <div className="h-32 flex justify-center items-center">
          <p className="text-sm text-stone-500 dark:text-stone-400">
            {headings.length === 0
              ? t("noHeadings")
              : "選択したレベルの見出しがありません"}
          </p>
        </div>
      )}
    </section>
  );
}
