import { computeAccessibleName } from "dom-accessibility-api";
import getXPath from "get-xpath";
import { getLandmarkRole } from "@/aria/getLandmarkRole";
import type { Landmark } from "@/types";
import { isAriaHidden, isInAriaHidden } from "@/utils/isAriaHidden";
import { isHidden } from "@/utils/isHidden";

const landmarkSelectors = [
  "header",
  "nav",
  "main",
  "aside",
  "footer",
  "section",
  '[role="banner"]',
  '[role="navigation"]',
  '[role="main"]',
  '[role="complementary"]',
  '[role="contentinfo"]',
  '[role="search"]',
  '[role="form"]',
  '[role="region"]',
];

export const getLandmarks = (): Landmark[] => {
  return [
    ...document.querySelectorAll<HTMLElement>(landmarkSelectors.join(",")),
  ]
    .map<Landmark | undefined>((element) => {
      if (
        isHidden(element) ||
        isAriaHidden(element) ||
        isInAriaHidden(element)
      ) {
        return undefined;
      }
      const role = getLandmarkRole(element);
      if (!role) {
        return undefined;
      }
      const label = computeAccessibleName(element).trim();
      if (element.tagName.toLowerCase() === "section" && !label) {
        return undefined;
      }
      const xpath = getXPath(element);
      return {
        role,
        label,
        tag: element.tagName.toLowerCase(),
        xpath,
      };
    })
    .filter((l): l is Landmark => l !== undefined);
};
