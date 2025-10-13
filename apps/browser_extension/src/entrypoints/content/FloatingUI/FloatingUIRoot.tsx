import { StrictMode, use, useCallback, useEffect, useState } from "react";
import {
  addListener,
  type ExtensionMessage,
  type MessageListener,
  removeListener,
} from "@/ExtensionMessages";
import style from "../content.css?inline";
import { ExtensionContext } from "../ExtensionContext";
import { FrameContext } from "../FrameManager";
import { FloatingButton } from "./FloatingButton";
import { FloatingWindow } from "./FloatingWindow";

export function FloatingUIRoot({ windowHeight }: { windowHeight?: number }) {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const { userInterfaceSettings } = use(ExtensionContext);
  const { frameWindow } = use(FrameContext);

  const handleClosePanel = useCallback(() => {
    setIsPanelOpen(false);
  }, []);

  const [activeTab, setActiveTab] = useState<
    "headings" | "landmarks" | "text" | "speech"
  >("headings");

  const messageListener: MessageListener<ExtensionMessage> = useCallback(
    (message, _sender, _sendResponse) => {
      const { action } = message;
      if (action === "openUserInterface") {
        const { frameUrl, tab } = message;
        if (frameUrl && frameUrl !== frameWindow?.location?.href) {
          // Ignore messages from other frames
          return false;
        }
        setActiveTab(tab);
        setIsPanelOpen(true);
        return true;
      }
    },
    [frameWindow],
  );

  useEffect(() => {
    addListener(messageListener);
    return () => {
      removeListener(messageListener);
    };
  }, [messageListener]);

  useEffect(() => {
    (frameWindow || window).addEventListener("click", handleClosePanel);
    return () => {
      (frameWindow || window).removeEventListener("click", handleClosePanel);
    };
  });

  return (
    <StrictMode>
      <style>{style}</style>
      <div className="flex flex-col-reverse items-stretch">
        {userInterfaceSettings.showButtonOnPage && (
          <FloatingButton
            onToggle={() => {
              setIsPanelOpen((p) => !p);
            }}
            onClose={handleClosePanel}
            isOpen={isPanelOpen}
          />
        )}
        {isPanelOpen && (
          <div
            className="px-2 pl-4 shrink grow flex justify-stretch"
            style={{
              height: windowHeight
                ? `min(calc(${windowHeight}px - 5rem), 40rem)`
                : undefined,
            }}
          >
            <FloatingWindow
              onClose={handleClosePanel}
              activeTab={activeTab}
              onTabChange={(tab) => setActiveTab(tab)}
            />
          </div>
        )}
      </div>
    </StrictMode>
  );
}
