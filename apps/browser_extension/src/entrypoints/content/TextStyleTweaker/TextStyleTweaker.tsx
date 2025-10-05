import getXPath from "get-xpath";
import { use, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { TextCSS } from "@/components/TextCSS";
import { ExtensionContext } from "../ExtensionContext";

export const TextStyleTweaker = () => {
  const { currentTextStyle, getHostTextStyle } = use(ExtensionContext);

  const loadTextStyleSettings = async () => {
    const hostname = window.location.hostname;
    getHostTextStyle(hostname);
  };

  const renderedOnceRef = useRef(false);
  if (!renderedOnceRef.current) {
    loadTextStyleSettings();
    renderedOnceRef.current = true;
  }
  const [frames, _setFrames] = useState<Window[]>(Array.from(window.frames));
  const frameRootsRef = useRef<(HTMLElement | null)[]>(frames.map(() => null));

  // forEachは何度でも呼ばれて良いようにしておく
  frames.forEach((frame, index) => {
    if (!frameRootsRef.current[index]) {
      const root = frame.document.createElement("div");
      root.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 0;
      height: 0;`;
      root.id = "hiraku-web-frame-root-text-style-tweaker";
      frameRootsRef.current[index] = root;
      frame.document.body.appendChild(root);
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

  if (!currentTextStyle) {
    return null;
  }
  return (
    <>
      <TextCSS settings={currentTextStyle} />
      {frames.map((frame, index) => {
        const root = frameRootsRef.current[index];
        if (!root) return null;
        return createPortal(
          <TextCSS
            settings={currentTextStyle}
            key={getXPath(frame.frameElement)}
          />,
          root,
        );
      })}
    </>
  );
};
