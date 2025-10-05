export const getElementByXpaths = (xpaths: string[]): Element | null => {
  if (xpaths.length === 0) return null;

  // 最初のxpathでトップレベルの要素を取得
  let currentDoc: Document | null = document;
  let element: Element | null = null;

  for (let i = 0; i < xpaths.length; i++) {
    const xpath = xpaths[i];
    element = currentDoc.evaluate(
      xpath,
      currentDoc,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null,
    ).singleNodeValue as Element | null;

    if (!element) return null;

    // 最後の要素でなければ、次のframeのcontentDocumentを取得
    if (i < xpaths.length - 1) {
      const frameElement = element as HTMLIFrameElement | HTMLFrameElement;
      currentDoc = frameElement.contentDocument;
      if (!currentDoc) return null;
    }
  }

  return element;
};
