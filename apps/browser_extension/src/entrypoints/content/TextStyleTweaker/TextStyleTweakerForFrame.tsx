import { use } from "react";
import { TextCSS } from "@/components/TextCSS";
import { ExtensionContext } from "../ExtensionContext";

export const TextStyleTweakerForFrame = () => {
  const { currentTextStyle } = use(ExtensionContext);
  if (!currentTextStyle) {
    return null;
  }
  return <TextCSS settings={currentTextStyle} />;
};
