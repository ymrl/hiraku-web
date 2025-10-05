import { createI18n } from "@wxt-dev/i18n";
import getXPath from "get-xpath";
import { use, useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { Rect } from "@/types";
import { ExtensionContext } from "../ExtensionContext";
import { findBlock } from "./findBlock";
import { getSpeechContent } from "./getSpeechContent";
import { SpeechButton } from "./SpeechButton";

const { t } = createI18n();

export const Speech = () => {
  const { isSpeechEnabled } = use(ExtensionContext);
  if (!isSpeechEnabled) {
    return null;
  }
  return (
    <>
      <Speaker />
      <FrameSpeakers />
    </>
  );
};

export const FrameSpeakers = () => {
  // 初回レンダリング時のみframesがセットされる
  const [frames, _setFrames] = useState<Window[]>(Array.from(window.frames));
  const frameRootsRef = useRef<(HTMLElement | null)[]>(frames.map(() => null));

  // forEachは何度でも呼ばれて良いようにしておく
  frames.forEach((frame, index) => {
    if (!frameRootsRef.current[index]) {
      const root = frame.document.createElement("div");
      root.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 0;
      height: 0;
      z-index: 2147483647;`;
      root.id = "hiraku-web-frame-root-speech";
      frameRootsRef.current[index] = root;
      frame.document.body.appendChild(root);
    }
  });

  // unmout時にrootを削除
  useEffect(() => {
    return () => {
      frameRootsRef.current.forEach((root) => {
        if (root?.parentNode) {
          root.parentNode.removeChild(root);
        }
      });
    };
  }, []);
  return (
    <>
      {frames.map((frame, index) => {
        const root = frameRootsRef.current[index];
        if (!root) return null;
        return createPortal(
          <Speaker key={getXPath(frame.frameElement)} />,
          root,
        );
      })}
    </>
  );
};

export const Speaker = () => {
  const { speechSettings } = use(ExtensionContext);

  const [targetRect, setTargetRect] = useState<Rect | undefined>(undefined);
  const [speakingRect, setSpeakingRect] = useState<Rect | undefined>(undefined);
  const [isPaused, setIsPaused] = useState(false);

  const ref = useRef<HTMLDivElement>(null);
  const targetElementRef = useRef<Element | null>(null);
  const speakingElementRef = useRef<Element | null>(null);

  const handleSpeechEnd = useCallback(() => {
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
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
    }
    const utter = new SpeechSynthesisUtterance();
    setIsPaused(false);
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
  }, [targetRect, handleSpeechEnd, speechSettings]);

  useEffect(() => {
    const w = ref.current?.ownerDocument.defaultView || window;

    const handleMouseMove = (event: MouseEvent) => {
      if (!ref.current) {
        return;
      }
      if (!speechSynthesis.speaking) {
        setSpeakingRect(undefined);
      }
      const d = ref.current.ownerDocument;
      const elements = d
        .elementsFromPoint(event.clientX, event.clientY)
        .filter((el) => !ref.current?.contains(el));
      if (
        elements.some((el) =>
          ["iframe", "frameset", "frame"].includes(el.tagName.toLowerCase()),
        )
      ) {
        targetElementRef.current = null;
        setTargetRect(undefined);
        return;
      }

      const element = elements[0];
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
        const w = blockElement.ownerDocument.defaultView || window;
        setTargetRect({
          top: rect.top + w.scrollY,
          left: rect.left + w.scrollX,
          width: rect.width,
          height: rect.height,
        });
      } else {
        setTargetRect(undefined);
      }
    };
    const handleMouseOut = (e: MouseEvent) => {
      if (
        !e.relatedTarget ||
        (e.relatedTarget as HTMLElement).nodeName === "HTML"
      ) {
        setTargetRect(undefined);
        targetElementRef.current = null;
      }
    };
    w.addEventListener("mousemove", handleMouseMove);
    w.addEventListener("mouseout", handleMouseOut);
    return () => {
      if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
      }
      speakingElementRef.current = null;
      targetElementRef.current = null;
      w.removeEventListener("mousemove", handleMouseMove);
      w.removeEventListener("mouseout", handleMouseOut);
    };
  }, []);

  return (
    <div ref={ref}>
      {targetRect && (
        <SpeechButton
          onClick={() => {
            speech();
          }}
          rect={targetRect}
          zIndex={10}
        >
          {t("speech.clickTo")}
          {t("speech.readThisPartAloud")}
        </SpeechButton>
      )}
      {speakingRect && (
        <SpeechButton
          onClick={() => {
            isPaused ? speechSynthesis.resume() : speechSynthesis.pause();
            setIsPaused(!isPaused);
          }}
          rect={speakingRect}
          zIndex={20}
          speaking
        >
          {t("speech.clickTo")}
          {isPaused ? t("speech.resumeReading") : t("speech.pauseReading")}
        </SpeechButton>
      )}
    </div>
  );
};
