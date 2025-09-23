import type React from "react";
import { useEffect, useState } from "react";

interface HighlightPosition {
  top: number;
  left: number;
  width: number;
  height: number;
}

interface HighlightOverlayProps {
  targetElement: Element | null;
}

const HighlightOverlay: React.FC<HighlightOverlayProps> = ({
  targetElement,
}) => {
  const [position, setPosition] = useState<HighlightPosition | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!targetElement) {
      setIsVisible(false);
      return;
    }

    const updatePosition = () => {
      const rect = targetElement.getBoundingClientRect();
      const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
      const scrollY = window.pageYOffset || document.documentElement.scrollTop;

      setPosition({
        top: rect.top + scrollY,
        left: rect.left + scrollX,
        width: rect.width,
        height: rect.height,
      });
      setIsVisible(true);
    };

    updatePosition();

    // スクロールやリサイズ時に位置を更新
    const handleUpdate = () => {
      if (targetElement) {
        updatePosition();
      }
    };

    window.addEventListener("scroll", handleUpdate);
    window.addEventListener("resize", handleUpdate);

    return () => {
      window.removeEventListener("scroll", handleUpdate);
      window.removeEventListener("resize", handleUpdate);
    };
  }, [targetElement]);

  const handleMouseEnter = () => {
    // マウスオーバー時は何もしない（表示を維持）
  };

  const handleMouseLeave = () => {
    // マウスアウト時にハイライトを非表示
    setIsVisible(false);
  };

  if (!isVisible || !position) {
    return null;
  }

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: It does not has any pointer events
    <div
      style={{
        position: "absolute",
        top: `${position.top}px`,
        left: `${position.left}px`,
        width: `${position.width}px`,
        height: `${position.height}px`,
        backgroundColor: "rgba(255, 235, 59, 0.3)",
        border: "2px solid rgba(255, 193, 7, 0.8)",
        borderRadius: "4px",
        pointerEvents: "auto",
        zIndex: 1000000,
        boxSizing: "border-box",
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    />
  );
};

export default HighlightOverlay;
