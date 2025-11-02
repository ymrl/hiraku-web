import { createContext } from "react";
import type { TextStyleSettings } from "@/types";

export const TextStyleContext = createContext<{
  currentTextStyle: TextStyleSettings | undefined;
  updateCurrentTextStyle: (style: TextStyleSettings | undefined) => void;
  pageDefaultTextStyle: TextStyleSettings | undefined;
  load: (hostname: string) => Promise<void>;
}>({
  currentTextStyle: undefined,
  pageDefaultTextStyle: undefined,
  updateCurrentTextStyle: () => {},
  load: async () => {},
});
