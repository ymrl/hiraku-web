import { createI18n } from "@wxt-dev/i18n";
import { useId } from "react";

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
      className="shrink-0 flex space-x-4 justify-end items-center
     p-3 bg-stone-50 dark:bg-stone-800 border-b border-stone-200 dark:border-stone-700"
    >
      <label
        htmlFor={id}
        className="text-sm font-medium text-stone-600 dark:text-stone-300"
      >
        {t("Levels")}:
      </label>
      <div className="flex items-center space-x-3">
        <span className="text-xs text-stone-500 dark:text-stone-400">1</span>
        <input
          id={id}
          type="range"
          min="1"
          max="7"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="flex-1 h-2 bg-stone-200 dark:bg-stone-600 rounded-lg appearance-none cursor-pointer
                     [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
                     [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-rose-500 [&::-webkit-slider-thumb]:cursor-pointer
                     [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:border-0
                     [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full
                     [&::-moz-range-thumb]:bg-rose-500 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-0"
        />
        <span className="text-xs text-stone-500 dark:text-stone-400">7</span>
        <div className="w-12 text-center">
          <span className="text-sm font-medium text-rose-600 dark:text-rose-400">
            {value === 7 ? t("All") : `H${value}`}
          </span>
        </div>
      </div>
    </div>
  );
}
