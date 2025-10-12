import getXPath from "get-xpath";
import type { Heading } from "@/types";
import { isAriaHidden, isInAriaHidden } from "@/utils/isAriaHidden";
import { isHidden } from "@/utils/isHidden";

const getHeadingsFromDocument = (
  doc: Document,
  xpathPrefix: string[] = [],
  exclude?: string,
): Heading[] => {
  const headingElements = doc.querySelectorAll(
    "h1, h2, h3, h4, h5, h6, [role='heading']",
  );
  const headings = [...headingElements]
    .map<Heading | undefined>((element) => {
      if (
        isHidden(element) ||
        isAriaHidden(element) ||
        isInAriaHidden(element)
      ) {
        return undefined;
      }
      if (exclude && element.closest(exclude)) {
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
        xpaths: [...xpathPrefix, xpath],
      };
    })
    .filter((h): h is Heading => h !== undefined);

  // iframe と frame 内も探索
  const frames = doc.querySelectorAll("iframe, frame");
  for (const frame of frames) {
    try {
      const frameElement = frame as HTMLIFrameElement | HTMLFrameElement;
      const frameDoc = frameElement.contentDocument;
      if (!frameDoc) continue;

      const frameXPath = getXPath(frame);
      const frameHeadings = getHeadingsFromDocument(
        frameDoc,
        [...xpathPrefix, frameXPath],
        exclude,
      );
      headings.push(...frameHeadings);
    } catch (_e) {}
  }

  return headings;
};

export const getHeadings = (options?: { exclude?: string }): Heading[] => {
  return getHeadingsFromDocument(document, [], options?.exclude);
};
