import {
  type RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { defaultColors } from "@/theme/defaultColors";
import { focusTargetElement } from "./focusTargetElement";
import { getElementRect, type Rect } from "./getElementRect";

const INSET = "-0.375rem";
const INNER_BORDER = "0.125rem";
const OUTER_BORDER = "0.25rem";

export const Highlight = ({
  elementRef,
}: {
  elementRef: RefObject<Element | null>;
}) => {
  const [highlightRect, setHighlightRect] = useState<Rect | null>(
    getElementRect(elementRef.current),
  );

  const focusedRef = useRef(false);
  if (!focusedRef.current && elementRef.current) {
    focusedRef.current = true;
    focusTargetElement(elementRef.current);
  }

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const close = useCallback(() => {
    setHighlightRect(null);
  }, []);

  if (!timeoutRef.current) {
    timeoutRef.current = setTimeout(close, 10000);
  }

  useEffect(() => {
    window.addEventListener("keydown", close);
    window.addEventListener("mousedown", close);
    window.addEventListener("touchstart", close);
    return () => {
      window.removeEventListener("keydown", close);
      window.removeEventListener("mousedown", close);
      window.removeEventListener("touchstart", close);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [close]);

  const { top, left, width, height } = highlightRect || {};

  return (
    highlightRect && (
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          pointerEvents: "none",
          zIndex: 2147483647,
          top: `${top}px`,
          left: `${left}px`,
          width: `${width}px`,
          height: `${height}px`,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: INSET,
            border: "0.125rem solid",
            borderStyle: "solid",
            borderWidth: INNER_BORDER,
            borderColor: defaultColors.rose[50],
            borderRadius: "0.5rem",
            zIndex: 20,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: INSET,
            borderStyle: "solid",
            borderWidth: OUTER_BORDER,
            borderColor: defaultColors.rose[400],
            borderRadius: "0.5rem",
            zIndex: 10,
          }}
        />
      </div>
    )
  );
};
