import getXPath from "get-xpath";
import {
  Fragment,
  type ReactNode,
  use,
  useCallback,
  useEffect,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { RootContext } from "../../entrypoints/content/Root/RootContext";
import { FrameContext } from "./FrameContext";

const isExcludeFrame = (el: HTMLFrameElement | HTMLIFrameElement) =>
  el.matches("[data-hiraku-web-iframe='true']");

const getFrames = () =>
  [
    ...document.querySelectorAll<HTMLFrameElement | HTMLIFrameElement>(
      "iframe,frame",
    ),
  ].filter((el) => !isExcludeFrame(el));

const getElementByIdFromFrame = (
  frame: HTMLFrameElement | HTMLIFrameElement,
  id: string,
) => {
  try {
    const d = frame.contentDocument;
    if (!d) return null;
    return d.getElementById(id);
  } catch {
    return null;
  }
};

export const FrameManager = ({ children }: { children?: ReactNode }) => {
  const { id } = use(RootContext);
  const frameRootId = `hiraku-web-frame-root-${id}`;
  // iframe. frame要素を取得（FloatingUIのものは除外）
  const [frameElements, setFrameElements] = useState<
    (HTMLFrameElement | HTMLIFrameElement)[]
  >(() => {
    const frameElements = getFrames();
    return frameElements;
  });

  const [, forceUpdate] = useState({});

  // frame要素のrootを作成する関数
  const createFrameRoot = useCallback(
    (frameElement: HTMLFrameElement | HTMLIFrameElement) => {
      try {
        if (isExcludeFrame(frameElement)) return;
        const frame = frameElement.contentWindow;
        if (!frame) return;
        if (!frame.document || !frame.document.body) return;

        // 既存のrootを削除
        const existingRoot = frame.document.getElementById(frameRootId);
        if (existingRoot?.parentNode) {
          existingRoot.parentNode.removeChild(existingRoot);
        }

        const root = frame.document.createElement("div");
        root.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 0;
        height: 0;
        z-index: 2147483647;`;
        root.id = frameRootId;
        frame.document.body.appendChild(root);

        // 強制的に再レンダリング
        forceUpdate({});
      } catch {
        /* noop */
      }
    },
    [frameRootId],
  );

  // MutationObserverで動的に追加されるframe要素を監視
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      let hasNewFrames = false;

      for (const mutation of mutations) {
        // 追加されたノードをチェック
        for (const node of mutation.addedNodes) {
          if (node instanceof HTMLElement) {
            // 追加されたノード自体がframe要素かチェック
            if (node.matches("iframe, frame")) {
              hasNewFrames = true;
            }
            // 追加されたノードの子孫にframe要素があるかチェック
            const frames = node.querySelectorAll<
              HTMLFrameElement | HTMLIFrameElement
            >("iframe, frame");
            if (frames.length > 0) {
              hasNewFrames = true;
            }
          }
        }

        // 削除されたノードをチェック
        for (const node of mutation.removedNodes) {
          if (node instanceof HTMLElement) {
            if (node.matches("iframe, frame")) {
              hasNewFrames = true;
            }
            const frames = node.querySelectorAll<
              HTMLFrameElement | HTMLIFrameElement
            >("iframe, frame");
            if (frames.length > 0) {
              hasNewFrames = true;
            }
          }
        }
      }

      // 新しいframeが見つかったら状態を更新（FloatingUIのものは除外）
      if (hasNewFrames) {
        setFrameElements(getFrames());
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, []);

  // frame要素ごとにrootを作成し、loadイベントを監視
  frameElements.forEach((frameElement) => {
    if (isExcludeFrame(frameElement)) return;
    try {
      const root = getElementByIdFromFrame(frameElement, frameRootId);
      if (!root) {
        createFrameRoot(frameElement);
        const loadListener = () => {
          // iframe内でページ遷移が発生したので、rootを再作成
          createFrameRoot(frameElement);
          // frameElementsに追加されていない場合は追加
          setFrameElements((frames) =>
            frames.includes(frameElement) ? frames : [...frames, frameElement],
          );
        };
        frameElement.addEventListener("load", loadListener);

        // pagehideイベント時にframeElementsから削除した状態をrender (再render時のエラー抑止)
        const prehideListener = () => {
          // frameElementがpagehideされた場合はframeElementsから削除
          setFrameElements((frames) =>
            frames.filter((f) => f !== frameElement),
          );
        };
        frameElement.contentWindow?.addEventListener(
          "pagehide",
          prehideListener,
        );
      }
    } catch {
      /* noop */
    }
  });

  return (
    <>
      {frameElements.map((frameElement) => {
        let frameWindow: Window | null = null;
        try {
          frameWindow = frameElement.contentWindow || null;
          const root = getElementByIdFromFrame(frameElement, frameRootId);

          if (!root) return null;
          const tagName = frameElement.tagName.toLowerCase();
          const frameType =
            tagName === "iframe"
              ? "iframe"
              : tagName === "frame"
                ? "frame"
                : null;
          const xpath = getXPath(root);
          return createPortal(
            <Fragment key={xpath}>
              <FrameContext value={{ frameType, frameElement, frameWindow }}>
                {children}
              </FrameContext>
            </Fragment>,
            root,
          );
        } catch {
          return null;
        }
      })}
    </>
  );
};
