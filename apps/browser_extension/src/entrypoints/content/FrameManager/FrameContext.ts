import { createContext } from "react";

export const FrameContext = createContext<{
  frameType: "iframe" | "frame" | null;
}>({ frameType: null });
