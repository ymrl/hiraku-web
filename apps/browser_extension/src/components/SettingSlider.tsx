import { useId } from "react";
import { Slider } from "./Slider";

export const SettingSlider = ({
  label,
  value,
  min,
  max,
  step,
  onChange,
  unit = "",
  displayValue,
  disabled = false,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  unit?: string;
  displayValue?: (value: number) => string;
  disabled?: boolean;
}) => {
  const id = useId();
  const displayText = displayValue
    ? displayValue(value ?? 0)
    : `${(value ?? 0).toFixed(step < 0.1 ? 2 : 1)}${unit}`;

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label
          htmlFor={id}
          className={`text-sm font-medium ${
            disabled
              ? "text-stone-600 dark:text-stone-400"
              : "text-stone-800 dark:text-stone-300"
          }`}
        >
          {label}
        </label>
        <span
          className={`text-sm font-bold ${
            disabled
              ? "text-stone-600 dark:text-stone-400"
              : "text-rose-600 dark:text-rose-400"
          } min-w-12 text-right`}
        >
          {displayText}
        </span>
      </div>
      <Slider
        id={id}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        disabled={disabled}
      />
    </div>
  );
};
