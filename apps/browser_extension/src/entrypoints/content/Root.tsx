import { createElement, createRef, type RefObject } from "react";
import { createRoot } from "react-dom/client";
import { MessageResponder } from "./ExtensionContext/MessageResponder";
import { FrameManager } from "./FrameManager";
import { LandmarkNavigation } from "./LandmarkNavigation";
import { Speaker } from "./Speaker";
import { TextStyleTweaker, TextStyleTweakerForFrame } from "./TextStyleTweaker";

export const createRootElement = () => {
  const root = document.createElement("div");
  root.id = "hiraku-web-content-root";
  root.style.cssText = `
    position: absolute;
    top: 0;
    left: 0;
    width: 0;
    height: 0;
    z-index: 2147483647;
  `;
  document.body.appendChild(root);
  const reactRoot = createRoot(root);
  const rootRef = createRef<HTMLDivElement | null>();
  rootRef.current = root;
  reactRoot.render(createElement(Root, { rootRef }));
  return root;
};

export const Root = ({
  rootRef,
}: {
  rootRef: RefObject<HTMLElement | null>;
}) => {
  return (
    <MessageResponder>
      <TextStyleTweaker />
      <LandmarkNavigation rootRef={rootRef} />
      <Speaker />

      <FrameManager>
        <TextStyleTweakerForFrame />
        <Speaker />
      </FrameManager>
    </MessageResponder>
  );
};
