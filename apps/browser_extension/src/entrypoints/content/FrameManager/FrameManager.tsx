import getXPath from "get-xpath";
import { Fragment, type ReactNode, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export const FrameManager = ({ children }: { children?: ReactNode }) => {
  // iframe. frame要素を取得
  const [frameElements, _setFrameElements] = useState<
    (HTMLFrameElement | HTMLIFrameElement)[]
  >([
    ...document.querySelectorAll<HTMLFrameElement | HTMLIFrameElement>(
      "iframe,frame",
    ),
  ]);

  const frameRootsRef = useRef<(HTMLElement | null)[]>(
    frameElements.map(() => null),
  );

  // forEachは何度でも呼ばれて良いようにしておく
  frameElements.forEach((frameElement, index) => {
    if (!frameRootsRef.current[index]) {
      try {
        const frame = frameElement.contentWindow;
        if (!frame) return;
        if (!frame.document || !frame.document.body) return;
        const root = frame.document.createElement("div");
        root.style.cssText = `
          position: absolute;
          top: 0;
          left: 0;
          width: 0;
          height: 0
          z-index: 2147483647;`;
        root.id = "hiraku-web-frame-root";
        frameRootsRef.current[index] = root;
        frame.document.body.appendChild(root);
      } catch {
        /* noop */
      }
    }
  });

  // unmout時にrootを削除
  useEffect(() => {
    return () => {
      frameRootsRef.current.forEach((root) => {
        if (root?.parentNode) {
          root.parentNode.removeChild(root);
        }
      });
    };
  }, []);

  return (
    <>
      {frameElements.map((frameElement, index) => {
        const root = frameRootsRef.current[index];
        if (!root) return null;
        return createPortal(
          <Fragment key={getXPath(frameElement)}>{children}</Fragment>,
          root,
        );
      })}
    </>
  );
};
