import {
  createElement,
  createRef,
  type RefObject,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { createPortal } from "react-dom";
import { createRoot } from "react-dom/client";
import { MessageResponder } from "./ExtensionContext/MessageResponder";
import {
  type FloatingUIHandle,
  FloatingUIRoot,
  initFloatingUI,
} from "./FloatingUI";
import { FrameManager } from "./FrameManager";
import { LandmarkNavigation } from "./LandmarkNavigation";
import { Speaker } from "./Speaker";
import { TextStyleTweaker } from "./TextStyleTweaker";

export const createRootElement = () => {
  const parent = document.createElement("div");
  parent.id = "hiraku-web-content-root";
  document.body.appendChild(parent);
  const root = document.createElement("div");
  parent.appendChild(root);
  const reactRoot = createRoot(root);
  const { iframeRoot } = initFloatingUI({ parent });
  const rootRef = createRef<HTMLDivElement | null>();
  const iframeRootRef = createRef<HTMLDivElement | null>();
  iframeRootRef.current = iframeRoot || null;
  rootRef.current = root;
  reactRoot.render(createElement(Root, { rootRef, iframeRootRef }));
  return root;
};

export const Root = ({
  rootRef,
  iframeRootRef,
}: {
  rootRef: RefObject<HTMLElement | null>;
  iframeRootRef: RefObject<HTMLElement | null>;
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

  return (
    <MessageResponder>
      <TextStyleTweaker />
      <LandmarkNavigation rootRef={rootRef} />
      <Speaker />

      {iframeRootRef.current &&
        createPortal(
          <FloatingUIRoot handleRef={handleRef} />,
          iframeRootRef.current,
        )}

      <FrameManager>
        <TextStyleTweaker />
        <Speaker />
      </FrameManager>
    </MessageResponder>
  );
};
