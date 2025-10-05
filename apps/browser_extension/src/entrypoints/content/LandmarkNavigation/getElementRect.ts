export type Rect = {
  top: number;
  left: number;
  width: number;
  height: number;
};

export const getElementRect = (element: Element | null): Rect | null => {
  if (!element) return null;
  const rect = element.getBoundingClientRect();
  return {
    top: rect.top + window.scrollY,
    left: rect.left + window.scrollX,
    width: rect.width,
    height: rect.height,
  };
};