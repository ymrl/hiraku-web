import { useCallback, useEffect, useRef } from "react";

export const Highlight = ({
  top,
  left,
  width,
  height,
  onClose,
}: {
  top: number;
  left: number;
  width: number;
  height: number;
  onClose?: () => void;
}) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const close = useCallback(() => {
    onClose?.();
  }, [onClose]);

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
