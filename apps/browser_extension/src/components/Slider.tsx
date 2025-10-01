import type { ChangeEventHandler } from "react";

export const Slider = ({
  id,
  min,
  max,
  step,
  value,
  onChange,
  width = "w-full",
  disabled = false,
}: {
  id: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: ChangeEventHandler<HTMLInputElement>;
  width?: string;
  disabled?: boolean;
}) => (
  <input
    id={id}
    type="range"
    min={min}
    max={max}
    step={step}
    value={value ?? 0}
    onChange={onChange}
    disabled={disabled}
    className={`${width} h-2 bg-stone-200 dark:bg-stone-600 rounded-lg appearance-none
                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
                [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-rose-500
                disabled:[&::-webkit-slider-thumb]:bg-stone-500
                [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:border-0
                [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full
                [&::-moz-range-thumb]:bg-rose-500 [&::-moz-range-thumb]:border-0
                disabled:[&::-moz-range-thumb]:bg-stone-500
                disabled:opacity-70`}
  />
);
