import { createContext, type RefObject } from "react";
export const RootContext = createContext<{
  id: string;
  rootRef: RefObject<HTMLElement | null>;
}>({ id: "", rootRef: { current: null } });
