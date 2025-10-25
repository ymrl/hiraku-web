import {
  type CamelCaseAria,
  convertCamelizedAttributes,
} from "aria-attribute-types";
import type { ReactNode } from "react";

export const Switch = ({
  isOn,
  children,
  onToggle,
  ...ariaProps
}: {
  isOn: boolean;
  children?: ReactNode;
  onToggle?: (newState: boolean) => void;
} & Omit<CamelCaseAria<"button">, "ariaPressed">) => (
  <button
    type="button"
    onClick={() => onToggle?.(!isOn)}
    className={
      "w-11 h-6 rounded-full relative " +
      (isOn
        ? "bg-rose-600 hover:not-disabled:bg-rose-600 "
        : "bg-stone-600 hover:bg-stone-600 ") +
      "before:content-[''] before:absolute before:z-10 before:rounded-full before:h-5 before:w-5 before:transition-all " +
      "before:left-[2px] before:top-[2px] " +
      "before:bg-stone-100 hover:before:bg-white " +
      (isOn ? "before:translate-x-full before:border-white " : "")
    }
    aria-pressed={isOn}
    {...convertCamelizedAttributes(ariaProps)}
  >
    <span
      aria-hidden="true"
      className={
        "before:content-[''] before:absolute before:top-1.5 before:bottom-1.5 before:right-3 before:w-0 " +
        "before:border-l-2 before:border-white before:opacity-80 " +
        "after:content-[''] after:absolute after:top-1.5 after:left-1.5 after:w-3 after:h-3 " +
        "after:border-2 after:rounded-full after:border-white after:opacity-80"
      }
    />
    {children && <span className="sr-only">{children}</span>}
  </button>
);
