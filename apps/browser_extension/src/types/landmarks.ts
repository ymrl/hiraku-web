import type { LANDMARK_ROLE } from "@/constants";

export type LandmarkRole =
  | "banner"
  | "complementary"
  | "contentinfo"
  | "form"
  | "main"
  | "navigation"
  | "search"
  | "region";

export type Landmark = {
  role: LANDMARK_ROLE;
  label?: string;
  tag: string;
  xpaths: string[];
};

export type Heading = {
  level: number;
  text: string;
  xpaths: string[];
};
