import { createI18n } from "@wxt-dev/i18n";
import { use, useCallback, useEffect, useRef, useState } from "react";
import { defaultColors } from "@/theme/defaultColors";
import { ExtensionContext } from "../ExtensionContext";
import { getSpeechContent } from "./getSpeechContent";

const INSET = "min(-0.375rem, -6px)"; //  -6px
const INNER_BORDER = "max(0.125rem, 2px)"; // 2px
const OUTER_BORDER = "max(0.25rem, 4px)"; // 4px

const { t } = createI18n();

const findBlock = (element: Element): Element | null => {
  return element.closest(
    "div, p, article, section, main, header, footer, aside, nav, ul, ol, dl, li, dt, dd, blockquote, h1, h2, h3, h4, h5, h6, table, pre",
  );
};

type Rect = {
  top: number;
  left: number;
  width: number;
  height: number;
};

export const Speech = ({
  rootRef,
}: {
  rootRef: React.RefObject<HTMLElement | null>;
}) => {
  const { isSpeechEnabled, speechSettings } = use(ExtensionContext);

  const [targetRect, setTargetRect] = useState<Rect | undefined>(undefined);
  const [speakingRect, setSpeakingRect] = useState<Rect | undefined>(undefined);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const ref = useRef<HTMLDivElement>(null);
  const targetElementRef = useRef<Element | null>(null);
  const speakingElementRef = useRef<Element | null>(null);

  const handleSpeechEnd = useCallback(() => {
    setIsSpeaking(false);
    setSpeakingRect(undefined);
    speakingElementRef.current = null;
  }, []);

  const speech = useCallback(async () => {
    if (!targetElementRef.current) {
      return;
    }
    const content = getSpeechContent(targetElementRef.current);
    if (!content) {
      return;
    }
    if (isSpeaking) {
      speechSynthesis.cancel();
    }
    const utter = new SpeechSynthesisUtterance();
    setIsPaused(false);
    setIsSpeaking(true);
    setSpeakingRect(targetRect);
    setTargetRect(undefined);

    utter.text = content;

    // 設定を適用
    utter.rate = speechSettings?.rate || 1;
    utter.pitch = speechSettings?.pitch || 1;
    utter.volume = speechSettings?.volume || 1;

    if (speechSettings?.voice) {
      const voices = speechSynthesis.getVoices();
      const selectedVoice = voices.find(
        (voice) => voice.name === speechSettings.voice,
      );
      if (selectedVoice) {
        utter.voice = selectedVoice;
      }
    }

    speechSynthesis.speak(utter);
    speakingElementRef.current = targetElementRef.current;
    utter.onend = handleSpeechEnd;
  }, [isSpeaking, targetRect, handleSpeechEnd, speechSettings]);

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      if (!ref.current) {
        return;
      }
      const element = document
        .elementsFromPoint(event.clientX, event.clientY)
        .find(
          (el) => !rootRef.current?.contains(el) && !ref.current?.contains(el),
        );
      const candidate =
        targetElementRef.current === element
          ? targetElementRef.current
          : element
            ? findBlock(element)
            : null;
      const blockElement =
        candidate !== speakingElementRef.current ? candidate : null;
      if (blockElement) {
        targetElementRef.current = blockElement;
        const rect = blockElement.getBoundingClientRect();
        setTargetRect({
          top: rect.top + window.scrollY,
          left: rect.left + window.scrollX,
          width: rect.width,
          height: rect.height,
        });
      } else {
        setTargetRect(undefined);
      }
    },
    [rootRef],
  );

  useEffect(() => {
    if (!isSpeechEnabled) {
      setIsSpeaking(false);
      setIsPaused(false);
      speechSynthesis.cancel();
      speakingElementRef.current = null;
      targetElementRef.current = null;
      return;
    }
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove, isSpeechEnabled]);

  return (
    <div ref={ref}>
      {isSpeechEnabled && targetRect && (
        <button
          onClick={() => {
            speech();
          }}
          type="button"
          style={{
            position: "absolute",
            background: "transparent",
            border: 0,
            zIndex: 10,
            top: `${targetRect.top}px`,
            left: `${targetRect.left}px`,
            width: `${targetRect.width}px`,
            height: `${targetRect.height}px`,
          }}
        >
          <span
            style={{
              position: "absolute",
              inset: INSET,
              border: "0.125rem solid",
              borderStyle: "solid",
              borderWidth: INNER_BORDER,
              borderColor: defaultColors.indigo[50],
              borderRadius: "0.5rem",
              zIndex: 20,
            }}
          />
          <span
            style={{
              position: "absolute",
              inset: INSET,
              borderStyle: "solid",
              borderWidth: OUTER_BORDER,
              borderColor: defaultColors.indigo[600],
              borderRadius: "0.5rem",
              zIndex: 10,
            }}
          />
          <span
            style={{
              position: "absolute",
              bottom: "calc(100% + max(1rem, 16px))",
              left: "50%",
              transform: "translateX(-50%)",
              display: "inline-block",
              textAlign: "center",
              borderStyle: "solid",
              borderWidth: "max(0.125rem, 2px)",
              borderColor: defaultColors.indigo[600],
              backgroundColor: "white",
              color: defaultColors.indigo[800],
              fontSize: "max(0.75rem, 12px)", // text-xs
              fontWeight: "bold",
              padding: "max(0.25rem, 4px) max(0.5rem, 8px)", // py-1 px-2
              borderRadius: "max(2rem, 32px)",
              whiteSpace: "nowrap",
            }}
          >
            {t("speech.clickTo")}
            {t("speech.readThisPartAloud")}
            <span
              style={{
                position: "absolute",
                bottom: "min(-0.5rem, -8px)",
                left: "50%",
                transform: "translateX(-50%)",
                width: 0,
                height: 0,
                borderWidth: "max(0.5rem, 8px)",
                borderStyle: "solid",
                borderColor: "transparent",
                borderTopColor: defaultColors.indigo[600],
                borderBottom: "0",
              }}
            />
          </span>
        </button>
      )}
      {isSpeaking && speakingRect && (
        <button
          onClick={() => {
            isPaused ? speechSynthesis.resume() : speechSynthesis.pause();
            setIsPaused(!isPaused);
          }}
          type="button"
          style={{
            position: "absolute",
            zIndex: 20,
            background: "transparent",
            border: 0,
            top: `${speakingRect.top}px`,
            left: `${speakingRect.left}px`,
            width: `${speakingRect.width}px`,
            height: `${speakingRect.height}px`,
          }}
        >
          <span
            style={{
              position: "absolute",
              inset: INSET,
              border: "0.125rem solid",
              borderStyle: "solid",
              borderWidth: INNER_BORDER,
              borderColor: defaultColors.emerald[50],
              borderRadius: "0.5rem",
              zIndex: 20,
            }}
          />
          <span
            style={{
              position: "absolute",
              inset: INSET,
              borderStyle: "solid",
              borderWidth: OUTER_BORDER,
              borderColor: defaultColors.emerald[600],
              borderRadius: "0.5rem",
              zIndex: 10,
            }}
          />
          <span
            style={{
              position: "absolute",
              bottom: "calc(100% + max(1rem, 16px))",
              left: "50%",
              transform: "translateX(-50%)",
              display: "inline-block",
              textAlign: "center",
              borderStyle: "solid",
              borderWidth: "max(0.125rem, 2px)",
              borderColor: defaultColors.emerald[600],
              backgroundColor: "white",
              color: defaultColors.emerald[800],
              fontSize: "max(0.75rem, 12px)", // text-xs
              fontWeight: "bold",
              padding: "max(0.25rem, 4px) max(0.5rem, 8px)", // py-1 px-2
              borderRadius: "max(2rem, 32px)",
              whiteSpace: "nowrap",
            }}
          >
            {t("speech.clickTo")}
            {isPaused ? t("speech.resumeReading") : t("speech.pauseReading")}
            <span
              style={{
                position: "absolute",
                bottom: "min(-0.5rem, -8px)",
                left: "50%",
                transform: "translateX(-50%)",
                width: 0,
                height: 0,
                borderWidth: "max(0.5rem, 8px)",
                borderStyle: "solid",
                borderColor: "transparent",
                borderTopColor: defaultColors.emerald[600],
                borderBottom: "0",
              }}
            />
          </span>
        </button>
      )}
    </div>
  );
};
