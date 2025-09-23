import { createI18n } from "@wxt-dev/i18n";
import type { MouseEventHandler } from "react";

const { t } = createI18n();

interface TabNavigationProps {
  activeTab: "headings" | "landmarks";
  onTabChange: (tab: "headings" | "landmarks") => void;
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
    className={`px-3 pt-1.5 pb-1 text-sm font-bold rounded-t-md transition-colors cursor-pointer ${
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
    <nav>
      <div
        className="flex space-x-2 px-3 pt-1 bg-stone-200 dark:bg-stone-800"
        role="tablist"
      >
        <Tab
          isActive={activeTab === "headings"}
          label={t("headings")}
          onClick={() => onTabChange("headings")}
        />
        <Tab
          isActive={activeTab === "landmarks"}
          label={t("landmarks")}
          onClick={() => onTabChange("landmarks")}
        />
      </div>
    </nav>
  );
}
