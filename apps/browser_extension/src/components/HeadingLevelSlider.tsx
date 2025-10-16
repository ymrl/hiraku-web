import { createI18n } from "@wxt-dev/i18n";
import { useId } from "react";
import { Slider } from "@/components/Slider";

const { t } = createI18n();

export function HeadingLevelSlider({
  value,
  onChange,
  disabled = false,
}: {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}) {
  const id = useId();
  return (
    <div className="shrink-0 flex gap-2 justify-stretch items-center">
      <label htmlFor={id} className="sr-only">
        {t("Levels")}:
      </label>
      <div className="flex items-center grow">
        <Slider
          id={id}
          min={1}
          max={7}
          step={1}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(Number(e.target.value))}
          width="w-24 grow"
        />
      </div>
      <span
        className={`text-sm font-medium shrink-0 w-12 ${
          disabled
            ? "text-stone-500 dark:text-stone-500"
            : "text-rose-600 dark:text-rose-400"
        }`}
      >
        {value === 7 ? t("All") : `H${value}`}
      </span>
    </div>
  );
}
