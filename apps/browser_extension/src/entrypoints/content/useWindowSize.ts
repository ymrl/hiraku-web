import { useCallback, useEffect, useRef, useState } from "react";

const THROTTLE_INTERVAL = 50;

export const useWindowSize = () => {
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const lastResizeTimeRef = useRef(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleResize = useCallback(() => {
    setWindowHeight(window.innerHeight);
    setWindowWidth(window.innerWidth);
  }, []);

  const throttled = useCallback(() => {
    const now = Date.now();
    const diff = now - lastResizeTimeRef.current;
    if (diff < THROTTLE_INTERVAL) {
      if (!timeoutRef.current) {
        timeoutRef.current = setTimeout(handleResize, THROTTLE_INTERVAL - diff);
      }
      return;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setWindowHeight(window.innerHeight);
    lastResizeTimeRef.current = now;
  }, [handleResize]);

  useEffect(() => {
    window.addEventListener("resize", throttled);
    return () => {
      window.removeEventListener("resize", throttled);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [throttled]);
  return { windowHeight, windowWidth };
};
