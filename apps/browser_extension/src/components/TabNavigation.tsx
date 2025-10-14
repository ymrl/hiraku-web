import { createI18n } from "@wxt-dev/i18n";
import type { MouseEventHandler } from "react";

const { t } = createI18n();

interface TabNavigationProps {
  activeTab: "tableOfContents" | "text" | "speech";
  onTabChange: (tab: "tableOfContents" | "text" | "speech") => void;
}
const onTabKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
  if (e.key === "ArrowLeft") {
    e.preventDefault();
    const prevTab = e.currentTarget
      .previousElementSibling as HTMLElement | null;
    prevTab?.focus();
  } else if (e.key === "ArrowRight") {
    e.preventDefault();
    const nextTab = e.currentTarget.nextElementSibling as HTMLElement | null;
    nextTab?.focus();
  }
};

const Tab = ({
  isActive,
  label,
  onClick,
}: {
  isActive: boolean;
  label: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
}) => (
  <button
    type="button"
    role="tab"
    aria-selected={isActive}
    tabIndex={isActive ? 0 : -1}
    onClick={onClick}
    onKeyDown={onTabKeyDown}
    className={`px-2 pt-1.5 pb-1 text-sm font-bold rounded-t-md transition-colors cursor-pointer whitespace-nowrap ${
      isActive
        ? `bg-white text-rose-600 shadow-sm
           dark:bg-stone-600 dark:text-rose-50
           border-b-4 border-b-rose-400`
        : `text-stone-600 hover:text-stone-800
           dark:text-stone-300 dark:hover:text-stone-100
           hover:bg-stone-100 hover:border-b-stone-400
           dark:hover:bg-stone-700 dark:hover:border-b-stone-600
           border-b-4 border-transparent`
    }`}
  >
    {label}
  </button>
);

export function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  return (
    <div
      className="flex gap-1 px-3 pt-1 bg-stone-200 dark:bg-stone-800"
      role="tablist"
    >
      <Tab
        isActive={activeTab === "tableOfContents"}
        label={t("tableOfContents")}
        onClick={() => onTabChange("tableOfContents")}
      />
      <Tab
        isActive={activeTab === "text"}
        label={t("text")}
        onClick={() => onTabChange("text")}
      />
      <Tab
        isActive={activeTab === "speech"}
        label={t("speeches")}
        onClick={() => onTabChange("speech")}
      />
    </div>
  );
}
