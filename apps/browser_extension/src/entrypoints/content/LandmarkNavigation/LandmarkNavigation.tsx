import { type RefObject, use, useRef } from "react";
import { createPortal } from "react-dom";
import { ExtensionContext } from "../ExtensionContext";
import { getElementByXpaths } from "./getElementByXpaths";
import { Highlight } from "./Highlight";

const cleanUp = (frameRootRef: RefObject<Element | null>) => {
  if (!frameRootRef.current) return;
  frameRootRef.current.parentElement?.removeChild?.(frameRootRef.current);
};

export const LandmarkNavigation = ({
  rootRef,
}: {
  rootRef: RefObject<Element | null>;
}) => {
  const { xpaths, navigationTimestamp } = use(ExtensionContext);
  const elementRef = useRef<Element | null>(null);
  const element = getElementByXpaths(xpaths);
  const frameRootRef = useRef<Element | null>(null);
  elementRef.current = element;
  if (!element) {
    return;
  }
  if (element.ownerDocument !== rootRef.current?.ownerDocument) {
    // フレームの中
    if (frameRootRef.current?.ownerDocument !== element.ownerDocument) {
      cleanUp(frameRootRef);
      const d = element.ownerDocument;
      const root = d.createElement("div");
      root.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 0;
        height: 0;
        z-index: 2147483647;`;
      root.id = "hiraku-web-frame-root-landmark-navigation";
      frameRootRef.current = root;
      d.body.appendChild(root);
    }
    return createPortal(
      <Highlight
        elementRef={elementRef}
        key={`${navigationTimestamp}-${xpaths.join(",")}`}
      />,
      frameRootRef.current,
    );
  }

  return (
    <Highlight
      elementRef={elementRef}
      key={`${navigationTimestamp}-${xpaths.join(",")}`}
    />
  );
};
