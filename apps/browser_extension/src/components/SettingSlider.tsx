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
  toDisplay = (v) => v,
  fromDisplay = (v) => v,
  status = "active",
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  unit?: string;
  toDisplay?: (value: number) => number;
  fromDisplay?: (value: number) => number;
  status?: "active" | "inactive";
}) => {
  const id = useId();

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <label
          htmlFor={id}
          className={`text-sm font-medium ${
            status === "inactive"
              ? "text-stone-600 dark:text-stone-400"
              : "text-stone-800 dark:text-stone-300"
          }`}
        >
          {label}
        </label>
        <div className="flex items-center gap-0.5">
          <input
            type="number"
            min={toDisplay(min)}
            max={toDisplay(max)}
            step={toDisplay(step)}
            value={toDisplay(value)}
            onChange={(e) => {
              const displayValue = Number(e.target.value);
              if (!Number.isNaN(displayValue)) {
                const actualValue = fromDisplay(displayValue);
                onChange(Math.min(Math.max(actualValue, min), max));
              }
            }}
            className={`text-sm font-bold ${
              status === "inactive"
                ? "text-stone-600 dark:text-stone-400 bg-transparent"
                : "text-rose-600 dark:text-rose-400 bg-transparent hover:bg-white hover:dark:bg-stone-900 focus:bg-white focus:dark:bg-stone-900"
            } min-w-16 text-right border border-transparent hover:border-stone-300 hover:dark:border-stone-600 focus:border-stone-300 focus:dark:border-stone-600 rounded px-2 py-1 transition-colors`}
          />
          {unit && (
            <span
              className={`text-sm font-bold ${
                status === "inactive"
                  ? "text-stone-600 dark:text-stone-400"
                  : "text-rose-600 dark:text-rose-400"
              }`}
            >
              {unit}
            </span>
          )}
        </div>
      </div>
      <Slider
        id={id}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
};
