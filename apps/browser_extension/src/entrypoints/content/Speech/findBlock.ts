export const findBlock = (element: Element): Element | null => {
  return element.closest(
    "div, p, article, section, main, header, footer, aside, nav, ul, ol, dl, li, dt, dd, blockquote, h1, h2, h3, h4, h5, h6, table, pre",
  );
};
