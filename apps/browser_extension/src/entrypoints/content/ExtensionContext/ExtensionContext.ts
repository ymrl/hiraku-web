import { createContext } from "react";
import type { TextStyleSettings } from "@/types";

export const ExtensionContext = createContext<{
  currentTextStyle: TextStyleSettings | undefined;
  getHostTextStyle: (hostname: string) => Promise<void>;
  applyPageDefaultTextStyle: (textStyle: TextStyleSettings) => void;
}>({
  currentTextStyle: undefined,
  getHostTextStyle: () => Promise.resolve(void 0),
  applyPageDefaultTextStyle: () => {},
});
