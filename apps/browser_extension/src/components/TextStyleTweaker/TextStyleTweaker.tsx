import { use } from "react";
import { TextCSS } from "@/components/TextCSS";
import { TextStyleContext } from "@/TextStyle";

export const TextStyleTweaker = () => {
  const { currentTextStyle } = use(TextStyleContext);
  if (!currentTextStyle) {
    return null;
  }
  return <TextCSS settings={currentTextStyle} />;
};
