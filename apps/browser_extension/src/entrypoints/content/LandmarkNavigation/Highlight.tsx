import {
  type RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { focusTargetElement } from "./focusTargetElement";
import { getElementRect, type Rect } from "./getElementRect";

export const Highlight = ({
  elementRef,
}: {
  elementRef: RefObject<Element | null>;
}) => {
  const [highlightRect, setHighlightRect] = useState<Rect | null>(
    getElementRect(elementRef.current)
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
    <div
      className="absolute pointer-events-none rounded opacity-80
      before:content-['']
      before:absolute
      before:-inset-0.5
      before:border-2
      before:border-solid
      before:border-rose-50
      before:rounded
      before:z-20
      after:content-['']
      after:absolute
      after:-inset-0.5
      after:border-4
      after:box-content
      after:border-solid
      after:border-rose-400
      after:rounded
      after:z-10
    "
      style={{
        top: `${top}px`,
        left: `${left}px`,
        width: `${width}px`,
        height: `${height}px`,
      }}
    />
  );
};
