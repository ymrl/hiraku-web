import getXPath from "get-xpath";
import {
  Fragment,
  type ReactNode,
  use,
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { RootContext } from "../Root/RootContext";
import { FrameContext } from "./FrameContext";

export const FrameManager = ({ children }: { children?: ReactNode }) => {
  const { rootRef } = use(RootContext);
  // iframe. frame要素を取得（FloatingUIのものは除外）
  const [frameElements, setFrameElements] = useState<
    (HTMLFrameElement | HTMLIFrameElement)[]
  >([
    ...[
      ...document.querySelectorAll<HTMLFrameElement | HTMLIFrameElement>(
        "iframe,frame",
      ),
    ].filter((el) => !rootRef.current?.contains(el)),
  ]);

  const frameRootsRef = useRef<Map<string, HTMLElement>>(new Map());
  const frameLoadListenersRef = useRef<Map<string, () => void>>(new Map());
  const [, forceUpdate] = useState({});

  // frame要素のrootを作成する関数
  const createFrameRoot = (
    frameElement: HTMLFrameElement | HTMLIFrameElement,
    xpath: string,
  ) => {
    try {
      const frame = frameElement.contentWindow;
      if (!frame) return;
      if (!frame.document || !frame.document.body) return;

      // 既存のrootを削除
      const existingRoot = frameRootsRef.current.get(xpath);
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
      root.id = "hiraku-web-frame-root";
      frameRootsRef.current.set(xpath, root);
      frame.document.body.appendChild(root);

      // 強制的に再レンダリング
      forceUpdate({});
    } catch {
      /* noop */
    }
  };

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
        setFrameElements([
          ...[
            ...document.querySelectorAll<HTMLFrameElement | HTMLIFrameElement>(
              "iframe,frame",
            ),
          ].filter((el) => !rootRef.current?.contains(el)),
        ]);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, [rootRef]);

  // frame要素ごとにrootを作成し、loadイベントを監視
  frameElements.forEach((frameElement) => {
    const xpath = getXPath(frameElement);

    // rootが存在しない場合は作成
    if (!frameRootsRef.current.has(xpath)) {
      createFrameRoot(frameElement, xpath);
    }

    // loadイベントリスナーが存在しない場合は追加
    if (!frameLoadListenersRef.current.has(xpath)) {
      const loadListener = () => {
        // iframe内でページ遷移が発生したので、rootを再作成
        createFrameRoot(frameElement, xpath);
      };
      try {
        frameElement.addEventListener("load", loadListener);
        frameLoadListenersRef.current.set(xpath, loadListener);
      } catch {
        /* noop */
      }
    }
  });

  // 削除されたframe要素のrootとイベントリスナーをクリーンアップ
  useEffect(() => {
    const currentXPaths = new Set(frameElements.map((el) => getXPath(el)));
    const rootsToDelete: string[] = [];
    const listenersToDelete: string[] = [];

    for (const [xpath, root] of frameRootsRef.current.entries()) {
      if (!currentXPaths.has(xpath)) {
        if (root.parentNode) {
          root.parentNode.removeChild(root);
        }
        rootsToDelete.push(xpath);
      }
    }

    for (const [xpath, listener] of frameLoadListenersRef.current.entries()) {
      if (!currentXPaths.has(xpath)) {
        // frameElementを取得してイベントリスナーを削除
        const frameElement = document.evaluate(
          xpath,
          document,
          null,
          XPathResult.FIRST_ORDERED_NODE_TYPE,
          null,
        ).singleNodeValue as HTMLFrameElement | HTMLIFrameElement | null;
        if (frameElement) {
          try {
            frameElement.removeEventListener("load", listener);
          } catch {
            /* noop */
          }
        }
        listenersToDelete.push(xpath);
      }
    }

    for (const xpath of rootsToDelete) {
      frameRootsRef.current.delete(xpath);
    }

    for (const xpath of listenersToDelete) {
      frameLoadListenersRef.current.delete(xpath);
    }
  }, [frameElements]);

  // unmount時にすべてのrootとイベントリスナーを削除
  useEffect(() => {
    return () => {
      // rootを削除
      for (const root of frameRootsRef.current.values()) {
        if (root?.parentNode) {
          root.parentNode.removeChild(root);
        }
      }
      frameRootsRef.current.clear();

      // イベントリスナーを削除
      for (const [xpath, listener] of frameLoadListenersRef.current.entries()) {
        const frameElement = document.evaluate(
          xpath,
          document,
          null,
          XPathResult.FIRST_ORDERED_NODE_TYPE,
          null,
        ).singleNodeValue as HTMLFrameElement | HTMLIFrameElement | null;
        if (frameElement) {
          try {
            frameElement.removeEventListener("load", listener);
          } catch {
            /* noop */
          }
        }
      }
      frameLoadListenersRef.current.clear();
    };
  }, []);

  return (
    <>
      {frameElements.map((frameElement) => {
        const xpath = getXPath(frameElement);
        const root = frameRootsRef.current.get(xpath);
        if (!root) return null;
        const tagName = frameElement.tagName.toLowerCase();
        const frameType =
          tagName === "iframe"
            ? "iframe"
            : tagName === "frame"
              ? "frame"
              : null;
        let frameWindow: Window | null = null;
        try {
          frameWindow = frameElement.contentWindow || null;
        } catch {
          /* noop */
        }
        return createPortal(
          <Fragment key={xpath}>
            <FrameContext value={{ frameType, frameElement, frameWindow }}>
              {children}
            </FrameContext>
          </Fragment>,
          root,
        );
      })}
    </>
  );
};
