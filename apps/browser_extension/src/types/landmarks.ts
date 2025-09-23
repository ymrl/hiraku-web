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
  role: string;
  label?: string;
  tag: string;
  index: number;
  xpath: string;
};
export type Heading = {
  level: number;
  text: string;
  id?: string;
  index: number;
  xpath: string;
};
