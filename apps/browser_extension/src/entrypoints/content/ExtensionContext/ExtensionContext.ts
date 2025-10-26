import { createContext } from "react";
import type { TextStyleSettings, UserInterfaceSettings } from "@/types";

export const ExtensionContext = createContext<{
  currentTextStyle: TextStyleSettings | undefined;
  updateCurrentTextStyle: (style: TextStyleSettings | undefined) => void;
  pageDefaultTextStyle: TextStyleSettings | undefined;
  userInterfaceSettings: UserInterfaceSettings;
}>({
  currentTextStyle: undefined,
  pageDefaultTextStyle: undefined,
  updateCurrentTextStyle: () => {},
  userInterfaceSettings: { showButtonOnPage: false },
});
