import { createI18n } from "@wxt-dev/i18n";
import { useEffect, useMemo, useState } from "react";
import { browser } from "wxt/browser";
import type { Heading } from "../../types";
import { HeadingLevelSlider } from "./HeadingLevelSlider";

const { t } = createI18n();

interface HeadingsListProps {
  headings: Heading[];
  onScrollToElement: (xpath: string) => void;
}

const loadLevelFilter = async (): Promise<number> => {
  try {
    const result = await browser.storage.local.get("headingLevel");
    if (result.headingLevel) {
      return result.headingLevel;
    }
    return 7;
  } catch (err) {
    console.error("Failed to load heading level filter:", err);
    return 7;
  }
};

const saveLevelFlter = async (levelFilter: number) => {
  try {
    browser.storage.local.set({
      headingLevel: levelFilter,
    });
  } catch (err) {
    console.error("Failed to save heading level filter:", err);
  }
};

export function HeadingsList({
  headings,
  onScrollToElement,
}: HeadingsListProps) {
  const [levelFilter, setLevelFilter] = useState(7);
  const onLevelFilterChange = (level: number) => {
    setLevelFilter(level);
    saveLevelFlter(level);
  };

  useEffect(() => {
    loadLevelFilter().then((level) => {
      setLevelFilter(level);
    });
  }, []);

  const filteredHeadings = useMemo(() => {
    if (levelFilter === 7) return headings;
    return headings.filter((heading) => heading.level <= levelFilter);
  }, [headings, levelFilter]);

  return (
    <section className="flex flex-col">
      <HeadingLevelSlider value={levelFilter} onChange={onLevelFilterChange} />
      {filteredHeadings.length ? (
        <ul className="space-y-1 p-1">
          {filteredHeadings.map((heading, index) => (
            <li
              key={`${index}-${heading}`}
              className="flex items-stretch flex-col"
            >
              <button
                type="button"
                onClick={() => onScrollToElement(heading.xpath)}
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
        <p className="text-sm text-stone-500 dark:text-stone-400">
          {headings.length === 0
            ? t("noHeadings")
            : "選択したレベルの見出しがありません"}
        </p>
      )}
    </section>
  );
}
