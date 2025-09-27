import { computeAccessibleName } from "dom-accessibility-api";
import { type LANDMARK_ROLE, LANDMARK_ROLES } from "@/constants";

const SECTIONING_CONTENT_SELECTOR = "article, aside, nav, section";

export const getLandmarkRole = (
  element: HTMLElement,
): LANDMARK_ROLE | undefined => {
  if (element.hasAttribute("role")) {
    const roles = (element.getAttribute("role") || "").split(/\s+/);
    const role = roles[roles.length - 1];
    if (role && LANDMARK_ROLES.includes(role as LANDMARK_ROLE)) {
      return role as LANDMARK_ROLE;
    }
  }
  const tagName = element.tagName.toLowerCase();
  if (tagName === "aside") {
    const parentElement = element.parentElement;
    const sectioningAncestor = parentElement?.closest(
      SECTIONING_CONTENT_SELECTOR,
    );
    if (sectioningAncestor) {
      const accessibleName = computeAccessibleName(element);
      if (!accessibleName) {
        return undefined;
      }
    }
    return "complementary";
  }
  if (tagName === "footer" || tagName === "header") {
    const roleCandidate = tagName === "footer" ? "contentinfo" : "banner";
    const parentElement = element.parentElement;
    const sectioningAncestor = parentElement?.closest(
      SECTIONING_CONTENT_SELECTOR,
    );
    const mainAncestor = parentElement?.closest("main");
    if (sectioningAncestor || mainAncestor) {
      return undefined;
    }
    return roleCandidate;
  }
  if (tagName === "form") {
    return "form";
  }
  if (tagName === "main") {
    return "main";
  }
  if (tagName === "nav") {
    return "navigation";
  }
  if (tagName === "search") {
    return "search";
  }

  if (tagName === "section") {
    const accessibleName = computeAccessibleName(element);
    if (accessibleName) {
      return "region";
    }
  }
  return undefined;
};
