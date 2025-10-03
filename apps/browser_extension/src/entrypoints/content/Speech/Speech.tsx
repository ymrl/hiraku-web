import { createI18n } from "@wxt-dev/i18n";
import { useCallback, useEffect, useRef, useState } from "react";
import { browser } from "wxt/browser";
import type { SpeechMessage, SpeechSettings } from "@/types";
import { getSpeechContent } from "./getSpeechContent";

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
  shadowRootRef,
}: {
  shadowRootRef: React.RefObject<HTMLDivElement | null>;
}) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [speechSettings, setSpeechSettings] = useState<SpeechSettings>({
    rate: 1,
    pitch: 1,
    volume: 1,
    voice: "",
  });
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
    utter.rate = speechSettings.rate || 1;
    utter.pitch = speechSettings.pitch || 1;
    utter.volume = speechSettings.volume || 1;

    if (speechSettings.voice) {
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
          (el) =>
            !shadowRootRef.current?.contains(el) && !ref.current?.contains(el),
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
    [shadowRootRef],
  );

  const enableSpeech = useCallback(async () => {
    setIsEnabled(true);
    await browser.runtime.sendMessage({ action: "speechEnabled" });
  }, []);

  const disableSpeech = useCallback(async () => {
    setIsEnabled(false);
    speechSynthesis.cancel();
    setTargetRect(undefined);
    setSpeakingRect(undefined);
    setIsSpeaking(false);
    setIsPaused(false);
    await browser.runtime.sendMessage({ action: "speechDisabled" });
  }, []);

  useEffect(() => {
    document.addEventListener("visibilitychange", disableSpeech);
    return () =>
      document.removeEventListener("visibilitychange", disableSpeech);
  }, [disableSpeech]);

  useEffect(() => {
    if (!isEnabled) {
      setTargetRect(undefined);
      setSpeakingRect(undefined);
      setIsSpeaking(false);
      setIsPaused(false);
      speechSynthesis.cancel();
      speakingElementRef.current = null;
      targetElementRef.current = null;
      return;
    }
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove, isEnabled]);

  useEffect(() => {
    const messageListener: Parameters<
      typeof browser.runtime.onMessage.addListener
    >[0] = (message: SpeechMessage, _sender, sendResponse) => {
      if (message.action === "speechStatus") {
        sendResponse({ isEnabled });
        return true;
      }
      if (message.action === "enableSpeech") {
        enableSpeech();
        if (message.settings) {
          setSpeechSettings(message.settings);
        }
        sendResponse({ success: true });
        return true;
      }
      if (message.action === "disableSpeech") {
        disableSpeech();
        sendResponse({ success: true });
        return true;
      }
      if (message.action === "updateSpeechSettings") {
        if (message.settings) {
          setSpeechSettings(message.settings);
        }
        sendResponse({ success: true });
        return true;
      }
      return false;
    };

    browser.runtime.onMessage.addListener(messageListener);
    return () => {
      browser.runtime.onMessage.removeListener(messageListener);
    };
  }, [enableSpeech, disableSpeech, isEnabled]);

  return (
    isEnabled && (
      <div ref={ref}>
        {targetRect && (
          <button
            onClick={() => {
              speech();
            }}
            type="button"
            className="absolute z-10
              before:content-['']
              before:absolute
              before:-inset-0.5
              before:border-2
              before:border-solid
              before:border-indigo-50
              before:rounded
              before:z-20
              after:content-['']
              after:absolute
              after:-inset-0.5
              after:border-4
              after:box-content
              after:border-solid
              after:border-indigo-600
              after:rounded
              after:z-10
              "
            style={{
              top: `${targetRect.top}px`,
              left: `${targetRect.left}px`,
              width: `${targetRect.width}px`,
              height: `${targetRect.height}px`,
            }}
          >
            <span className="flex justify-center absolute bottom-full left-0 right-0">
              <span
                className="z-20 py-1 px-2 block rounded-lg border-2 border-solid border-indigo-600 bg-white text-indigo-800 text-xs font-bold whitespace-nowrap
               mb-2 relative
               before:content-[''] before:absolute before:bg-transparent
               before:border-solid
               before:border-l-8 before:border-l-transparent
               before:border-r-8 before:border-r-transparent
               before:border-t-8 before:border-t-indigo-600
               before:-bottom-[8px] before:left-1/2 before:-ml-[8px]
              "
              >
                {t("speech.clickTo")}
                {t("speech.readThisPartAloud")}
              </span>
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
            className="absolute z-30
              before:content-['']
              before:absolute
              before:-inset-0.5
              before:border-2
              before:border-solid
              before:border-emerald-50
              before:rounded
              before:z-20
              after:content-['']
              after:absolute
              after:-inset-0.5
              after:border-4
              after:box-content
              after:border-solid
              after:border-emerald-600
              after:rounded
              after:z-10"
            style={{
              top: `${speakingRect.top}px`,
              left: `${speakingRect.left}px`,
              width: `${speakingRect.width}px`,
              height: `${speakingRect.height}px`,
            }}
          >
            <span className="flex justify-center absolute bottom-full left-0 right-0">
              <span
                className="z-20 py-1 px-2 block rounded-lg border-2 border-solid border-emerald-600 bg-white text-emerald-800 text-xs font-bold whitespace-nowrap
               mb-2 relative
               before:content-[''] before:absolute before:bg-transparent
               before:border-solid
               before:border-l-8 before:border-l-transparent
               before:border-r-8 before:border-r-transparent
               before:border-t-8 before:border-t-emerald-600
               before:-bottom-[8px] before:left-1/2 before:-ml-[8px]
              "
              >
                {t("speech.clickTo")}
                {isPaused
                  ? t("speech.resumeReading")
                  : t("speech.pauseReading")}
              </span>
            </span>
          </button>
        )}
      </div>
    )
  );
};
