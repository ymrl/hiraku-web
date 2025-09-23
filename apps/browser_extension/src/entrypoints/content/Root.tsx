import { createElement } from "react";
import { createRoot } from "react-dom/client";
import { LandmarkNavigation } from "./LandmarkNavigation";

export const createRootElement = () => {
  const root = document.createElement("div");
  root.id = "raku-web-popup-root";
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
  reactRoot.render(
    createElement(Root, {})
  );

  window.addEventListener("beforeunload", () => {
    reactRoot.unmount(); 
  });
  return root;
}

export const Root = () => {
  return (<LandmarkNavigation />)
} 