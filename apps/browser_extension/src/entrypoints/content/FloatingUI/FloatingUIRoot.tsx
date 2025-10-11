import { StrictMode, useCallback, useImperativeHandle, useState } from "react";
import style from "../content.css?inline";
import { FloatingButton } from "./FloatingButton";
import { FloatingWindow } from "./FloatingWindow";

export type FloatingUIHandle = {
  closePanel: () => void;
};

export function FloatingUIRoot({
  handleRef,
  windowHeight,
}: {
  handleRef?: React.RefObject<FloatingUIHandle | null>;
  windowHeight?: number;
}) {
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const handleClosePanel = useCallback(() => {
    setIsPanelOpen(false);
  }, []);

  useImperativeHandle(
    handleRef,
    () => ({
      closePanel: handleClosePanel,
    }),
    [handleClosePanel],
  );

  return (
    <StrictMode>
      <style>{style}</style>
      <div className="flex flex-col-reverse items-stretch">
        <FloatingButton
          onToggle={() => {
            setIsPanelOpen((p) => !p);
          }}
          onClose={handleClosePanel}
          isOpen={isPanelOpen}
        />
        {isPanelOpen && (
          <div
            className="px-2 pl-4 shrink grow flex justify-stretch"
            style={{
              height: windowHeight
                ? `min(calc(${windowHeight}px - 5rem), 40rem)`
                : undefined,
            }}
          >
            <FloatingWindow onClose={handleClosePanel} />
          </div>
        )}
      </div>
    </StrictMode>
  );
}
