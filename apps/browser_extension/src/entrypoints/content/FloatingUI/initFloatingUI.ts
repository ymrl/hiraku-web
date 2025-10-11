export const FLOATING_UI_ID = "hiraku-web-floating-ui";

export const initFloatingUI = ({
  parent,
}: {
  parent: HTMLElement;
}): {
  iframe: HTMLIFrameElement;
  iframeRoot?: HTMLDivElement;
} => {
  // iframeを作成
  const iframe = document.createElement("iframe");
  iframe.id = FLOATING_UI_ID;
  iframe.style.cssText = `
    position: fixed;
    right: 0;
    bottom: 0;
    z-index: 2147483647;
    background: transparent;
    border: none;
  `;
  parent.appendChild(iframe);

  // iframe内にコンテンツを作成
  const iframeDoc = iframe.contentDocument;
  if (!iframeDoc) {
    console.error("Failed to access iframe document");
    return { iframe };
  }

  // React用のrootを作成
  const iframeRoot = iframeDoc.createElement("div");
  iframeRoot.id = "hiraku-web-floating-root";
  iframeDoc.body.style.cssText = `
    width: max-content;
    overflow: hidden;
    max-height: 100vh;
  `;
  iframeDoc.body.appendChild(iframeRoot);

  // iframe内のコンテンツサイズを監視して、iframeのサイズを調整
  const resizeObserver = new ResizeObserver(() => {
    if (!iframeRoot) return;
    const rect = iframeRoot.getBoundingClientRect();
    iframe.style.width = `${rect.width}px`;
    iframe.style.height = `min(calc(100vh - 16px), ${rect.height}px)`;
  });

  resizeObserver.observe(iframeRoot);

  return { iframe, iframeRoot };
};
