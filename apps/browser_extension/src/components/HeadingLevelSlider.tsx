import { createI18n } from "@wxt-dev/i18n";
import { useId } from "react";
import { Slider } from "@/components/Slider";

const { t } = createI18n();

export function HeadingLevelSlider({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) {
  const id = useId();
  return (
    <div
      className="shrink-0 flex gap-2 justify-stretch items-center sticky top-0 left-0 right-0
     p-3 bg-stone-100 dark:bg-stone-800 border-b border-stone-200 dark:border-stone-700"
    >
      <label
        htmlFor={id}
        className="text-sm font-medium text-stone-600 dark:text-stone-300 shrink-0"
      >
        {t("Levels")}:
      </label>
      <div className="flex items-center grow">
        <span className="text-xs text-stone-500 dark:text-stone-400 w-4 text-center">1</span>
        <Slider
          id={id}
          min={1}
          max={7}
          step={1}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          width="w-24 grow"
        />
        <span className="text-xs text-stone-500 dark:text-stone-400 w-4 text-center">7</span>
      </div>
      <span className="text-sm font-medium text-rose-600 dark:text-rose-400 shrink-0 w-12">
        {value === 7 ? t("All") : `H${value}`}
      </span>
    </div>
  );
}
