import { createContext } from "react";

export const NavigationContext = createContext<{
  xpaths: string[];
  navigationTimestamp: number;
  updateXpaths: (xpaths: string[]) => void;
}>({
  xpaths: [],
  navigationTimestamp: 0,
  updateXpaths: () => {},
});
