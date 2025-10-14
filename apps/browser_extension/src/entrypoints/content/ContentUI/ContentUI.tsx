import { use, useCallback, useEffect, useState } from "react";
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
import { Iframe } from "./Iframe";

export function ContentUI({
  windowHeight,
  windowWidth,
}: {
  windowHeight: number;
  windowWidth: number;
}) {
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
  const [temporarilyHidden, setTemporarilyHidden] = useState(false);
  const { frameType } = use(FrameContext);
  if (frameType === "iframe") {
    return null;
  }

  return (
    <Iframe>
      <style>{style}</style>
      <div className="flex flex-col-reverse items-stretch max-w-dvh">
        {userInterfaceSettings.showButtonOnPage && !temporarilyHidden && (
          <FloatingButton
            onToggle={() => {
              setIsPanelOpen((p) => !p);
            }}
            onClose={handleClosePanel}
            onHide={() => {
              setTemporarilyHidden(true);
              handleClosePanel();
            }}
            isOpen={isPanelOpen}
          />
        )}
        {isPanelOpen && (
          <div
            className="shrink grow flex justify-stretch px-2"
            style={{
              height: windowHeight
                ? `min(calc(${windowHeight}px - 5rem), 40rem)`
                : undefined,
              width: `max(min(${windowWidth}px, 25rem), 20rem)`,
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
    </Iframe>
  );
}
