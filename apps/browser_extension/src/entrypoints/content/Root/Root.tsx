import {
  createElement,
  createRef,
  type RefObject,
  use,
  useEffect,
  useId,
} from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "../ExtensionContext";
import { FloatingUIRoot } from "../FloatingUI";
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
  const { windowHeight } = useWindowHeight();
  const id = useId();
  useEffect(() => {
    rootRef.current?.setAttribute("id", id);
  }, [id, rootRef]);

  return (
    <RootContext value={{ id, rootRef }}>
      <Provider>
        <TextStyleTweaker />
        <LandmarkNavigation />
        <Speaker />
        <Iframe>
          <FloatingUIRoot windowHeight={windowHeight} />
        </Iframe>

        <FrameManager>
          <TextStyleTweaker />
          <Speaker />
          <UIFrame windowHeight={windowHeight} />
        </FrameManager>
      </Provider>
    </RootContext>
  );
};

const UIFrame = ({ windowHeight }: { windowHeight: number }) => {
  const { frameType } = use(FrameContext);
  if (frameType !== "frame") {
    return null;
  }

  return (
    <Iframe>
      <FloatingUIRoot windowHeight={windowHeight} />
    </Iframe>
  );
};
