import { createContext } from "react";
import type { UserInterfaceSettings } from "@/types";

export const ExtensionContext = createContext<{
  userInterfaceSettings: UserInterfaceSettings;
}>({
  userInterfaceSettings: { showButtonOnPage: false },
});
