import { createI18n } from "@wxt-dev/i18n";
import type { Heading } from "../../types";

const { t } = createI18n();

interface HeadingsListProps {
  headings: Heading[];
  onScrollToElement: (xpath: string) => void;
}

export function HeadingsList({
  headings,
  onScrollToElement,
}: HeadingsListProps) {
  return (
    <section className="px-1 py-2">
      {headings.length ? (
        <ul className="space-y-1">
          {headings.map((heading, index) => (
            <li
              key={`${index}-${heading}`}
              className="flex items-stretch flex-col"
            >
              <button
                type="button"
                onClick={() => onScrollToElement(heading.xpath)}
                className="text-left text-sm text-stone-800 dark:text-stone-200
                  hover:text-rose-800 dark:hover:text-rose-100
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
          {t("noHeadings")}
        </p>
      )}
    </section>
  );
}
