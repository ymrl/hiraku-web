import type { MouseEventHandler } from "react";
import { defaultColors } from "@/theme/defaultColors";
import type { Rect } from "@/types";

const INSET = "min(-0.375rem, -6px)"; //  -6px
const INNER_BORDER = "max(0.125rem, 2px)"; // 2px
const OUTER_BORDER = "max(0.25rem, 4px)"; // 4px

export const SpeechButton = ({
  rect,
  onClick,
  zIndex = 10,
  speaking = false,
  children,
}: {
  rect: Rect;
  onClick: MouseEventHandler<HTMLButtonElement>;
  zIndex?: number;
  speaking?: boolean;
  children?: React.ReactNode;
}) => {
  const color = speaking ? "emerald" : "indigo";
  return (
    <button
      onClick={onClick}
      type="button"
      style={{
        position: "absolute",
        background: "transparent",
        border: 0,
        zIndex,
        top: `${rect.top}px`,
        left: `${rect.left}px`,
        width: `${rect.width}px`,
        height: `${rect.height}px`,
      }}
    >
      <span
        style={{
          position: "absolute",
          inset: INSET,
          border: "0.125rem solid",
          borderStyle: "solid",
          borderWidth: INNER_BORDER,
          borderColor: defaultColors[color][50],
          borderRadius: "0.5rem",
          zIndex: 2,
        }}
      />
      <span
        style={{
          position: "absolute",
          inset: INSET,
          borderStyle: "solid",
          borderWidth: OUTER_BORDER,
          borderColor: defaultColors[color][600],
          borderRadius: "0.5rem",
          zIndex: 1,
        }}
      />
      <span
        style={{
          position: "absolute",
          bottom: "calc(100% + max(1rem, 16px))",
          left: "50%",
          transform: "translateX(-50%)",
          display: "inline-block",
          textAlign: "center",
          borderStyle: "solid",
          borderWidth: "max(0.125rem, 2px)",
          borderColor: defaultColors[color][600],
          backgroundColor: "white",
          color: defaultColors[color][800],
          fontSize: "max(0.75rem, 12px)", // text-xs
          fontWeight: "bold",
          padding: "max(0.25rem, 4px) max(0.5rem, 8px)", // py-1 px-2
          borderRadius: "max(2rem, 32px)",
          whiteSpace: "nowrap",
        }}
      >
        {children}
        <span
          style={{
            position: "absolute",
            bottom: "min(-0.5rem, -8px)",
            left: "50%",
            transform: "translateX(-50%)",
            width: 0,
            height: 0,
            borderWidth: "max(0.5rem, 8px)",
            borderStyle: "solid",
            borderColor: "transparent",
            borderTopColor: defaultColors[color][600],
            borderBottom: "0",
          }}
        />
      </span>
    </button>
  );
};
