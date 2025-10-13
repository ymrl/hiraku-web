import { createI18n } from "@wxt-dev/i18n";
import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";

const { t } = createI18n();

export const Iframe = ({ children }: { children?: React.ReactNode }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const rootRef = useRef<HTMLElement | null>(null);
  const [, reload] = useState(0);
  const id = useId();

  useEffect(() => {
    if (!iframeRef.current) return;
    const iframe = iframeRef.current;
    const iframeDoc = iframe.contentDocument;
    if (!iframeDoc) {
      return;
    }

    iframeDoc.body.style.cssText = `
      width: max-content;
      overflow: hidden;
      max-height: 100vh;
    `;
    // React用のrootを作成
    const iframeRoot =
      iframeDoc.getElementById(`iframe-${id}-root`) ||
      iframeDoc.createElement("div");
    iframeRoot.id = `iframe-${id}-root`;
    iframeRoot.setAttribute("data-hiraku-web-iframe-root", "true");
    iframeDoc.body.appendChild(iframeRoot);
    rootRef.current = iframeRoot;

    // rootRefの作成を反映させるために再レンダリング
    reload(Date.now());

    // iframe内のコンテンツサイズを監視して、iframeのサイズを調整
    const resizeObserver = new ResizeObserver(() => {
      if (!iframeRoot) return;
      const rect = iframeRoot.getBoundingClientRect();
      iframe.style.width = `${rect.width}px`;
      iframe.style.height = `min(100vh, ${rect.height}px)`;
    });
    resizeObserver.observe(iframeRoot);
    return () => {
      resizeObserver.disconnect();
      if (rootRef.current === iframeRoot) {
        rootRef.current = null;
      }
      iframeRoot.remove();
    };
  }, [id]);

  return (
    <>
      <iframe
        id={`hiraku-web-iframe-${id}`}
        title={t("IframeTitle")}
        ref={iframeRef}
        style={{
          position: "fixed",
          right: 0,
          bottom: 0,
          zIndex: 2147483647,
          background: "transparent",
          border: "none",
          maxWidth: "100dvw",
        }}
        data-hiraku-web-iframe="true"
      />
      {rootRef.current && createPortal(children, rootRef.current)}
    </>
  );
};
