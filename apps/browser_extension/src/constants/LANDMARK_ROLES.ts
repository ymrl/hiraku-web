export const LANDMARK_ROLES = [
  "banner",
  "complementary",
  "contentinfo",
  "form",
  "main",
  "navigation",
  "search",
  "region",
] as const;

export type LANDMARK_ROLE = (typeof LANDMARK_ROLES)[number];
