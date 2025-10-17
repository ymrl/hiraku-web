import type { TableOfContentsEntry } from "@/types";

/**
 * 見出しアイテム
 */
export function HeadingItem({
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
