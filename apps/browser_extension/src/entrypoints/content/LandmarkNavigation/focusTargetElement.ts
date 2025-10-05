import { getFocusableElement } from "./getFocusableElement";

export const focusTargetElement = (element: Element) => {
  const rect = element.getBoundingClientRect();
  const block = rect.height > window.innerHeight ? "start" : "center";
  element.scrollIntoView({ behavior: "smooth", block });
  const timeout = setTimeout(() => {
    listener();
  }, 1000);
  const listener = () => {
    getFocusableElement(element).focus();
    window.removeEventListener("scrollend", listener);
    clearTimeout(timeout);
  };
  window.addEventListener("scrollend", listener, { once: true });
};
