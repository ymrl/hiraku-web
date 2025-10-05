import { use, useRef } from "react";
import { ExtensionContext } from "../ExtensionContext";
import { getElementByXpaths } from "./getElementByXpaths";
import { Highlight } from "./Highlight";

export const LandmarkNavigation = () => {
  const { xpaths } = use(ExtensionContext);
  const elementRef = useRef<Element | null>(null);
  elementRef.current = getElementByXpaths(xpaths);

  return <Highlight elementRef={elementRef} key={xpaths.join(",")} />;
};
