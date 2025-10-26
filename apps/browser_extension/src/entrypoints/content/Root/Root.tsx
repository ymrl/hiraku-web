import {
  createElement,
  createRef,
  type RefObject,
  useEffect,
  useId,
} from "react";
import { createRoot } from "react-dom/client";
import { LandmarkNavigation } from "@/components/LandmarkNavigation";
import { useRespondingTableOfContentsMessage } from "@/TableOfContents";
import { Speaker } from "../../../components/Speaker";
import { TextStyleTweaker } from "../../../components/TextStyleTweaker";
import { ContentUI } from "../ContentUI";
import { Provider } from "../ExtensionContext";
import { FrameManager } from "../FrameManager";
import { useWindowSize } from "../useWindowSize";
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
  const windowSize: { windowHeight: number; windowWidth: number } =
    useWindowSize();
  const id = useId();
  useEffect(() => {
    rootRef.current?.setAttribute("id", id);
  }, [id, rootRef]);
  useRespondingTableOfContentsMessage({
    exclude: "[data-hiraku-web-iframe-root]",
  });

  return (
    <RootContext value={{ id, rootRef }}>
      <Provider>
        <TextStyleTweaker />
        <LandmarkNavigation rootRef={rootRef} />
        <Speaker />
        <ContentUI {...windowSize} />
        <FrameManager>
          <TextStyleTweaker />
          <Speaker />
          <ContentUI {...windowSize} />
        </FrameManager>
      </Provider>
    </RootContext>
  );
};
