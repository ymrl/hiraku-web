import { use, useCallback, useEffect, useRef, useState } from "react";
import { FloatingButton } from "@/components/FloatingButton";
import {
  addListener,
  type ExtensionMessage,
  type MessageListener,
  removeListener,
} from "@/ExtensionMessages";
import {
  type ExtensionTab,
  loadActiveTab,
  loadDefaultTextStyleSettings,
  saveActiveTab,
} from "@/storage";
import type { TextStyleSettings, UserInterfaceSettings } from "@/types";
import { FloatingWindow } from "..//FloatingWindow";
import { FrameContext } from "../FrameManager";
import { TextCSS } from "../TextCSS";
import style from "./content.css?inline";
import { Iframe } from "./Iframe";

export function ContentUI({
  windowHeight,
  windowWidth,
  userIntefaceSettings = {},
}: {
  windowHeight: number;
  windowWidth: number;
  userIntefaceSettings?: UserInterfaceSettings;
}) {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const { frameWindow } = use(FrameContext);
  const {
    showButtonOnPage = false,
    buttonOpacity = 0.5,
    buttonSize = "medium",
  } = userIntefaceSettings;

  const handleClosePanel = useCallback(() => {
    setIsPanelOpen(false);
  }, []);

  const [activeTab, setActiveTab] = useState<ExtensionTab>("tableOfContents");

  const [textSettings, setTextSettings] = useState<
    TextStyleSettings | undefined
  >(undefined);
  const loadedRef = useRef(false);
  if (!loadedRef.current) {
    (async () => {
      const savedTab = await loadActiveTab();
      setActiveTab(savedTab);
      const settings = await loadDefaultTextStyleSettings();
      setTextSettings(settings);
    })();
    loadedRef.current = true;
  }

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
        saveActiveTab(tab);
        return true;
      }
      if (action === "selectedTab") {
        const { tab } = message;
        setActiveTab(tab);
        saveActiveTab(tab);
        return true;
      }
    },
    [frameWindow],
  );

  const { frameType } = use(FrameContext);
  useEffect(() => {
    if (frameType === "iframe") return;
    addListener(messageListener);
    return () => {
      removeListener(messageListener);
    };
  }, [messageListener, frameType]);

  useEffect(() => {
    if (frameType === "iframe") return;
    (frameWindow || window).addEventListener("click", handleClosePanel);
    return () => {
      (frameWindow || window).removeEventListener("click", handleClosePanel);
    };
  });
  const [temporarilyHidden, setTemporarilyHidden] = useState(false);
  if (frameType === "iframe") {
    return null;
  }

  return (
    <Iframe>
      <style>{style}</style>
      {textSettings && <TextCSS settings={textSettings} />}
      <div className="flex flex-col-reverse items-stretch max-w-dvh">
        {showButtonOnPage && !temporarilyHidden && (
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
            size={buttonSize}
            opacity={buttonOpacity}
          />
        )}
        {isPanelOpen && (
          <div
            className="shrink grow flex justify-stretch px-2"
            style={{
              height: windowHeight
                ? `min(calc(${windowHeight}px - ${
                    buttonSize === "xsmall" // icon 24px
                      ? 4
                      : buttonSize === "small" // icon 36px
                        ? 4.5
                        : buttonSize === "large" // icon 64px
                          ? 6.5
                          : buttonSize === "xlarge" // icon 80px
                            ? 7.5
                            : 5 // icon 44px
                  }rem), 40rem)`
                : undefined,
              width: `max(min(${windowWidth}px, 25rem), 20rem)`,
            }}
          >
            <FloatingWindow
              onClose={handleClosePanel}
              activeTab={activeTab}
              onTabChange={(tab) => {
                setActiveTab(tab);
                saveActiveTab(tab);
              }}
            />
          </div>
        )}
      </div>
    </Iframe>
  );
}
