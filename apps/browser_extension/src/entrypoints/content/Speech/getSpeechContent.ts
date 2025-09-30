import { computeAccessibleName, getRole } from "dom-accessibility-api";
import { isAriaHidden, isInAriaHidden } from "@/utils/isAriaHidden";
import { isHidden } from "@/utils/isHidden";

const PRESENTATIONAL_ROLES = [
  "button",
  "checkbox",
  "img",
  "menuitemcheckbox",
  "menuitemradio",
  "meter",
  "option",
  "progressbar",
  "radio",
  "scrollbar",
  "separator",
  "slider",
  "switch",
  "tab",
];
const INLINE_ELEMENTS = [
  "a",
  "abbr",
  "b",
  "bdi",
  "bdo",
  "cite",
  "code",
  "del",
  "dfn",
  "em",
  "i",
  "ins",
  "kbd",
  "label",
  "mark",
  "q",
  "s",
  "samp",
  "small",
  "span",
  "strong",
  "sub",
  "sup",
  "time",
  "u",
  "var",
];

const IGNORE_ELEMENTS = [
  "col",
  "colgroup",
  "datalist",
  "head",
  "link",
  "meta",
  "noscript",
  "rp",
  "script",
  "slot",
  "style",
  "template",
]

export const getSpeechContent = (el: Element): string => nodeContent(el).trim();

const nodeContent = (node: Node): string => {
  if (node.nodeType === Node.TEXT_NODE) {
    return node.textContent || "";
  }
  if (node.nodeType !== Node.ELEMENT_NODE) {
    return "";
  }
  const el = node as Element;
  if (isHidden(el) || isAriaHidden(el) || isInAriaHidden(el)) {
    return "";
  }
  const tagName = el.tagName.toLowerCase();
  if (IGNORE_ELEMENTS.includes(tagName)) {
    return "";
  }
  const role = getRole(el);
  if (role && PRESENTATIONAL_ROLES.includes(role)) {
    return computeAccessibleName(el) || "";
  }
  if (tagName === "input" || tagName === "textarea") {
    const inputEl = el as HTMLInputElement;
    const accessibleName = computeAccessibleName(el);
    return `${accessibleName} ${inputEl.value}`.trim();
  }
  if (tagName === "select") {
    const selectEl = el as HTMLSelectElement;
    const accessibleName = computeAccessibleName(el);
    const selectedOptions = Array.from(selectEl.selectedOptions)
      .map((option) => option.textContent || "")
      .join(", ");
    return `${accessibleName} ${selectedOptions}`.trim();
  }
  if (tagName === "svg") {
    const accessibleName = computeAccessibleName(el);
    return accessibleName || "";
  }

  return `${[...el.childNodes]
    .reduce<string>((acc, child) => {
      return acc + nodeContent(child);
    }, "")
    .trim()}${INLINE_ELEMENTS.includes(tagName) ? "" : " "}`;
};
