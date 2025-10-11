import type { MouseEventHandler } from "react";

export const Button = ({
  onClick,
  children,
  appearance = "primary",
  disabled = false,
  size = "medium",
}: {
  onClick?: MouseEventHandler<HTMLButtonElement>;
  children: React.ReactNode;
  disabled?: boolean;
  appearance?: "primary" | "secondary";
  size?: "small" | "medium";
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={
      "transition-colors font-bold rounded-lg " +
      (size === "small" ? "px-3 py-2 text-xs " : "px-4 py-2 text-sm ") +
      (appearance === "primary"
        ? "bg-rose-600 hover:not-disabled:bg-rose-700 text-white " +
          "dark:bg-rose-600 dark:not-disabled:hover:bg-rose-700 " +
          "disabled:bg-stone-400 " +
          "dark:disabled:bg-stone-600 dark:disabled:text-stone-400 "
        : // secondary
          "bg-stone-300 hover:not-disabled:bg-stone-200 text-stone-700 " +
          "dark:bg-stone-600 dark:not-disabled:hover:bg-stone-700 dark:text-white " +
          "disabled:bg-stone-200 disabled:text-stone-500 " +
          "dark:disabled:bg-stone-700 dark:disabled:text-stone-400 ")
    }
  >
    {children}
  </button>
);
