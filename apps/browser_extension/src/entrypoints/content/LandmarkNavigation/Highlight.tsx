import { useEffect, useRef } from "react";

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
  if (!timeoutRef.current) {
    timeoutRef.current = setTimeout(() => {
      // 自動的に消えるようにする（3秒後）
      onClose?.();
    }, 3000);
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    }
  }, []);

  return (
    <div
      style={{
        position: "absolute",
        top: `${top}px`,
        left: `${left}px`,
        width: `${width}px`,
        height: `${height}px`,
        border: "2px solid red",
        boxSizing: "border-box",
        pointerEvents: "none",
      }}
    />
  );
};
