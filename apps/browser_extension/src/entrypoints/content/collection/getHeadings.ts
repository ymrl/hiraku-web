import getXPath from "get-xpath";
import type { Heading } from "@/types";
import { isAriaHidden, isInAriaHidden } from "@/utils/isAriaHidden";
import { isHidden } from "@/utils/isHidden";

export const getHeadings = (): Heading[] => {
  const headingElements = document.querySelectorAll(
    "h1, h2, h3, h4, h5, h6, [role='heading']",
  );
  return [...headingElements]
    .map<Heading | undefined>((element) => {
      if (
        isHidden(element) ||
        isAriaHidden(element) ||
        isInAriaHidden(element)
      ) {
        return undefined;
      }
      const text = element.textContent?.trim() || "";
      if (!text) return undefined;
      const tagName = element.tagName.toLowerCase();
      const level = tagName.match(/^h[1-6]$/)
        ? parseInt(element.tagName.substring(1), 10)
        : parseInt(element.getAttribute("aria-level") || "2", 10);
      const xpath = getXPath(element);
      return {
        level,
        text,
        xpath,
      };
    })
    .filter((h): h is Heading => h !== undefined);
};
