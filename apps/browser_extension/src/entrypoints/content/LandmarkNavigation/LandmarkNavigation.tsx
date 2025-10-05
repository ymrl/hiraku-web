import { use, useRef } from "react";
import { ExtensionContext } from "../ExtensionContext";
import { Highlight } from "./Highlight";
import { getElementByXpaths } from "./getElementByXpaths";

export const LandmarkNavigation = () => {
  const { xpaths } = use(ExtensionContext);
  const elementRef = useRef<Element | null>(null);
  elementRef.current = getElementByXpaths(xpaths);

  return <Highlight elementRef={elementRef} key={xpaths.join(",")} />;
};
