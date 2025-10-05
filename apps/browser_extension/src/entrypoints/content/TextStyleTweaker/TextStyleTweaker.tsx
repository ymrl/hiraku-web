import { use, useRef } from "react";
import { TextCSS } from "@/components/TextCSS";
import { ExtensionContext } from "../ExtensionContext";

export const TextStyleTweaker = () => {
  const { currentTextStyle, getHostTextStyle } = use(ExtensionContext);

  const loadTextStyleSettings = async () => {
    const hostname = window.location.hostname;
    getHostTextStyle(hostname);
  };

  const renderedOnceRef = useRef(false);
  if (!renderedOnceRef.current) {
    loadTextStyleSettings();
    renderedOnceRef.current = true;
  }

  return <TextCSS settings={currentTextStyle || {}} />;
};
