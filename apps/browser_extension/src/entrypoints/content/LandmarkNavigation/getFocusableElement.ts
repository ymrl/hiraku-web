const focusableSelector =
  "a,button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex],[contenteditable=true]";

export const getFocusableElement = (element: Element): HTMLElement => {
  if (element.matches(focusableSelector)) {
    return element as HTMLElement;
  }
  const focusableChild = element.querySelector<HTMLElement>(focusableSelector);
  if (focusableChild) {
    const rect = element.getBoundingClientRect();
    const childRect = focusableChild.getBoundingClientRect();
    console.log(rect, childRect);
    if (childRect.top - rect.top <= window.innerHeight / 2) {
      return focusableChild;
    }
  }
  const emptySpan = document.createElement("span");
  emptySpan.setAttribute("tabindex", "-1");
  element.prepend(emptySpan);
  emptySpan.focus();
  emptySpan.onblur = () => {
    emptySpan.remove();
  };
  return emptySpan;
};
