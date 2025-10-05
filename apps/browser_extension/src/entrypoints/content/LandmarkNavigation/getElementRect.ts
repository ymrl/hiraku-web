export type Rect = {
  top: number;
  left: number;
  width: number;
  height: number;
};

export const getElementRect = (element: Element | null): Rect | null => {
  if (!element) return null;
  const rect = element.getBoundingClientRect();
  const w = element.ownerDocument?.defaultView || window;

  return {
    top: rect.top + w.scrollY,
    left: rect.left + w.scrollX,
    width: rect.width,
    height: rect.height,
  };
};
