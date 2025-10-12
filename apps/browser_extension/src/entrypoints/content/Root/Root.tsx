import {
  createElement,
  createRef,
  type RefObject,
  use,
  useCallback,
  useEffect,
  useId,
  useRef,
} from "react";
import { createRoot } from "react-dom/client";
import { MessageResponder } from "../ExtensionContext/MessageResponder";
import { type FloatingUIHandle, FloatingUIRoot } from "../FloatingUI";
import { FrameContext, FrameManager } from "../FrameManager";
import { Iframe } from "../Iframe";
import { LandmarkNavigation } from "../LandmarkNavigation";
import { Speaker } from "../Speaker";
import { TextStyleTweaker } from "../TextStyleTweaker";
import { useWindowHeight } from "../useWindowHeight";
import { RootContext } from "./RootContext";

export const CONTENT_ROOT_ID = "hiraku-web-content-root";
export const createRootElement = () => {
  const parent = document.createElement("div");
  parent.id = CONTENT_ROOT_ID;
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
  const id = useId();
  useEffect(() => {
    rootRef.current?.setAttribute("id", id);
  }, [id, rootRef]);

  return (
    <RootContext value={{ id, rootRef }}>
      <MessageResponder>
        <TextStyleTweaker />
        <LandmarkNavigation />
        <Speaker />
        <Iframe>
          <FloatingUIRoot handleRef={handleRef} windowHeight={windowHeight} />
        </Iframe>

        <FrameManager>
          <TextStyleTweaker />
          <Speaker />
          <UIFrame />
        </FrameManager>
      </MessageResponder>
    </RootContext>
  );
};

const UIFrame = () => {
  const { frameType } = use(FrameContext);
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

  if (frameType !== "frame") {
    return null;
  }

  return (
    <Iframe>
      <FloatingUIRoot handleRef={handleRef} windowHeight={windowHeight} />
    </Iframe>
  );
};
