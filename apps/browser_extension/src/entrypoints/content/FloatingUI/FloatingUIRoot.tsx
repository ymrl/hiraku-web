import { StrictMode, useCallback, useImperativeHandle, useState } from "react";
import style from "../content.css?inline";
import { FloatingButton } from "./FloatingButton";
import { FloatingWindow } from "./FloatingWindow";

export type FloatingUIHandle = {
  closePanel: () => void;
};

export function FloatingUIRoot({
  handleRef,
}: {
  handleRef?: React.RefObject<FloatingUIHandle | null>;
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
      <div className="flex flex-col-reverse items-stretch justify-end">
        <FloatingButton
          onToggle={() => {
            setIsPanelOpen((p) => !p);
          }}
          onClose={handleClosePanel}
          isOpen={isPanelOpen}
        />
        {isPanelOpen && (
          <div className="shrink overflow-auto">
            <FloatingWindow onClose={handleClosePanel} />
          </div>
        )}
      </div>
    </StrictMode>
  );
}
