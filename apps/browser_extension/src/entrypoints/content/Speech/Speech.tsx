import { createI18n } from "@wxt-dev/i18n";
import { useCallback, useEffect, useRef, useState } from "react";
import { browser } from "wxt/browser";
import type { SpeechMessage, SpeechSettings } from "@/types";

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
  const [buttonRect, setButtonRect] = useState<Rect | undefined>(undefined);
  const [speakingRect, setSpeakingRect] = useState<Rect | undefined>(undefined);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const ref = useRef<HTMLDivElement>(null);
  const blockElementRef = useRef<Element | null>(null);
  const speakingElementRef = useRef<Element | null>(null);

  const handleSpeechEnd = useCallback(() => {
    setIsSpeaking(false);
    setSpeakingRect(undefined);
    speakingElementRef.current = null;
  }, []);

  const speech = useCallback(async () => {
    if (!blockElementRef.current) {
      return;
    }
    if (isSpeaking) {
      speechSynthesis.cancel();
    }
    setIsPaused(false);
    setIsSpeaking(true);
    setSpeakingRect(buttonRect);
    const utter = new SpeechSynthesisUtterance();
    utter.text = blockElementRef.current.textContent;

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
    speakingElementRef.current = blockElementRef.current;
    utter.onend = handleSpeechEnd;
  }, [isSpeaking, buttonRect, handleSpeechEnd, speechSettings]);

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
        blockElementRef.current === element
          ? blockElementRef.current
          : element
            ? findBlock(element)
            : null;
      const blockElement =
        candidate !== speakingElementRef.current ? candidate : null;
      if (blockElement) {
        blockElementRef.current = blockElement;
        const rect = blockElement.getBoundingClientRect();
        setButtonRect({
          top: rect.top + window.scrollY,
          left: rect.left + window.scrollX,
          width: rect.width,
          height: rect.height,
        });
      } else {
        setButtonRect(undefined);
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
    setButtonRect(undefined);
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
      setButtonRect(undefined);
      setSpeakingRect(undefined);
      setIsSpeaking(false);
      setIsPaused(false);
      speechSynthesis.cancel();
      speakingElementRef.current = null;
      blockElementRef.current = null;
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
        {buttonRect && (
          <button
            aria-label={t("speech.readThisPartAloud")}
            onClick={() => {
              speech();
            }}
            type="button"
            style={{
              border: 0,
              position: "absolute",
              backgroundColor: "rgba(255, 128, 128, 0.3)",
              top: `${buttonRect.top}px`,
              left: `${buttonRect.left}px`,
              width: `${buttonRect.width}px`,
              height: `${buttonRect.height}px`,
            }}
          />
        )}
        {isSpeaking && speakingRect && (
          <button
            aria-label={
              isPaused ? t("speech.resumeReading") : t("speech.pauseReading")
            }
            onClick={() => {
              isPaused ? speechSynthesis.resume() : speechSynthesis.pause();
              setIsPaused(!isPaused);
            }}
            type="button"
            style={{
              border: 0,
              position: "absolute",
              backgroundColor: "rgba(128 128, 255, 0.3)",
              top: `${speakingRect.top}px`,
              left: `${speakingRect.left}px`,
              width: `${speakingRect.width}px`,
              height: `${speakingRect.height}px`,
            }}
          />
        )}
      </div>
    )
  );
};
