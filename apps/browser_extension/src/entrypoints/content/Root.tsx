import {
  createElement,
  createRef,
  type RefObject,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { createRoot } from "react-dom/client";
import { MessageResponder } from "./ExtensionContext/MessageResponder";
import { type FloatingUIHandle, FloatingUIRoot } from "./FloatingUI";
import { FrameManager } from "./FrameManager";
import { Iframe } from "./Iframe";
import { LandmarkNavigation } from "./LandmarkNavigation";
import { Speaker } from "./Speaker";
import { TextStyleTweaker } from "./TextStyleTweaker";
import { useWindowHeight } from "./useWindowHeight";

export const createRootElement = () => {
  const parent = document.createElement("div");
  parent.id = "hiraku-web-content-root";
  document.body.appendChild(parent);
  const root = document.createElement("div");
  parent.appendChild(root);
  const reactRoot = createRoot(root);
  const rootRef = createRef<HTMLDivElement | null>();
  rootRef.current = root;
  reactRoot.render(
    createElement(Root, {
      rootRef,
    }),
  );
  return root;
};

export const Root = ({
  rootRef,
}: {
  rootRef: RefObject<HTMLElement | null>;
}) => {
  const handleRef = useRef<FloatingUIHandle | null>(null);

  const windowClicked = useCallback(() => {
    handleRef.current?.closePanel();
  }, []);

  useEffect(() => {
    window.addEventListener("click", windowClicked);
    return () => {
      window.removeEventListener("click", windowClicked);
    };
  }, [windowClicked]);

  const { windowHeight } = useWindowHeight();

  return (
    <MessageResponder>
      <TextStyleTweaker />
      <LandmarkNavigation rootRef={rootRef} />
      <Speaker />
      <Iframe>
        <FloatingUIRoot handleRef={handleRef} windowHeight={windowHeight} />
      </Iframe>

      <FrameManager>
        <TextStyleTweaker />
        <Speaker />
      </FrameManager>
    </MessageResponder>
  );
};
