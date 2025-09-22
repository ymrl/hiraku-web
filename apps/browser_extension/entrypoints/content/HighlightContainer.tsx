import React, { useCallback, useState } from "react";
import HighlightOverlay from "./HighlightOverlay";

interface HighlightContainerProps {
  onHighlightMount: (
    highlightFunction: (element: Element | null) => void,
  ) => void;
}

const HighlightContainer: React.FC<HighlightContainerProps> = ({
  onHighlightMount,
}) => {
  const [highlightedElement, setHighlightedElement] = useState<Element | null>(
    null,
  );

  const highlightElement = useCallback((element: Element | null) => {
    setHighlightedElement(element);
  }, []);

  // 親に関数を渡す
  React.useEffect(() => {
    onHighlightMount(highlightElement);
  }, [onHighlightMount, highlightElement]);

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 999999,
      }}
    >
      <HighlightOverlay targetElement={highlightedElement} />
    </div>
  );
};

export default HighlightContainer;
