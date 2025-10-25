import { createI18n } from "@wxt-dev/i18n";
import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { TextCSS } from "@/components/TextCSS";
import type { TextStyleSettings } from "@/types";

const { t } = createI18n();

const JapanesePreviewTexts = `吾輩は猫である。名前はまだ無い。
どこで生れたかとんと見当がつかぬ。何でも薄暗いじめじめした所でニャーニャー泣いていた事だけは記憶している。
吾輩はここで始めて人間というものを見た。しかもあとで聞くとそれは書生という人間中で一番獰悪な種族であったそうだ。
`.split("\n");

const EnglishPreviewTexts =
  `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
`.split("\n");

export const TextStylePreviewIFrame = ({
  textStyle,
}: {
  textStyle: TextStyleSettings;
}) => {
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
    const iframeRoot =
      iframeDoc.getElementById(`iframe-${id}-root`) ||
      iframeDoc.createElement("div");
    iframeRoot.id = `iframe-${id}-root`;
    iframeDoc.body.appendChild(iframeRoot);
    rootRef.current = iframeRoot;
    reload(Date.now());
  }, [id]);

  return (
    <>
      <iframe
        className="width-full overflow-hidden bg-stone-50 dark:bg-stone-700 rounded-lg shrink grow flex flex-col border border-stone-300 dark:border-stone-600"
        title={t("options.preview")}
        id={id}
        ref={iframeRef}
      />
      {rootRef.current &&
        createPortal(
          <>
            {EnglishPreviewTexts.map((line) => (
              <p key={line}>{line}</p>
            ))}
            {JapanesePreviewTexts.map((line) => (
              <p key={line}>{line}</p>
            ))}
            <TextCSS settings={textStyle} />
            <style>
              body {"{"}
              margin: 0.5rem; font-size: 100%; color-scheme: light dark;
              {"}"}
              @media(prefers-color-scheme: dark) {"{"}
              body {"{"}
              color: #fff;
              {"}"}
              {"}"}
            </style>
          </>,
          rootRef.current,
        )}
    </>
  );
};
