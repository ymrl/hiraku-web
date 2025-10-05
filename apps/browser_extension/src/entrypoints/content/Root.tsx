import { createElement, useRef } from "react";
import { createRoot } from "react-dom/client";
import shadow from "react-shadow";
import style from "./content.css?inline";
import { MessageResponder } from "./ExtensionContext/MessageResponder";
import { LandmarkNavigation } from "./LandmarkNavigation";
import { Speech } from "./Speech";
import { TextStyleTweaker } from "./TextStyleTweaker";

export const createRootElement = () => {
  const root = document.createElement("div");
  root.id = "hiraku-web-content-root";
  root.style.cssText = `
    position: absolute;
    top: 0;
    left: 0;
    width: 0;
    height: 0;
    z-index: 2147483647;
  `;
  document.body.appendChild(root);
  const reactRoot = createRoot(root);
  reactRoot.render(createElement(Root, {}));
  return root;
};

export const Root = () => {
  const shadowRootRef = useRef<HTMLDivElement>(null);
  return (
    <MessageResponder>
      <TextStyleTweaker />
      <LandmarkNavigation />
      <shadow.div ref={shadowRootRef}>
        <style>{style}</style>
        <Speech shadowRootRef={shadowRootRef} />
      </shadow.div>
    </MessageResponder>
  );
};
