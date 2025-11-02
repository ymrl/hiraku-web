import { createContext } from "react";

export const FrameContext = createContext<{
  frameType: "iframe" | "frame" | null;
  frameElement: HTMLIFrameElement | HTMLFrameElement | null;
  frameWindow: Window | null;
}>({ frameType: null, frameElement: null, frameWindow: null });
