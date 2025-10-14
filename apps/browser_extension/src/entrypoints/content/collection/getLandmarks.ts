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

const getLandmarksFromDocument = (
  doc: Document,
  xpathPrefix: string[] = [],
  exclude?: string,
): Landmark[] => {
  const landmarks = [
    ...doc.querySelectorAll<HTMLElement>(landmarkSelectors.join(",")),
  ]
    .map<Landmark | undefined>((element) => {
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
        xpaths: [...xpathPrefix, xpath],
      };
    })
    .filter((l): l is Landmark => l !== undefined);

  // iframe と frame 内も探索
  const frames = doc.querySelectorAll("iframe, frame");
  for (const frame of frames) {
    try {
      const frameElement = frame as HTMLIFrameElement | HTMLFrameElement;
      const frameDoc = frameElement.contentDocument;
      if (!frameDoc) continue;

      const frameXPath = getXPath(frame);
      const frameLandmarks = getLandmarksFromDocument(
        frameDoc,
        [...xpathPrefix, frameXPath],
        exclude,
      );
      landmarks.push(...frameLandmarks);
    } catch (_e) {}
  }

  return landmarks;
};

export const getLandmarks = (options?: { exclude?: string }): Landmark[] => {
  return getLandmarksFromDocument(document, [], options?.exclude);
};
