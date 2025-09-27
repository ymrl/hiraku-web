import { afterEach, describe, expect, test } from "vitest";
import { LANDMARK_ROLES } from "@/constants";
import { getLandmarkRole } from "./getLandmarkRole";

const SECTIONING_CONTENT_TAGS = ["article", "aside", "nav", "section"];

describe("getLandmarkRole()", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  test("no role", () => {
    const element = document.createElement("div");
    document.body.appendChild(element);
    expect(getLandmarkRole(element)).toBeUndefined();
  });

  test("other role", () => {
    const element = document.createElement("div");
    element.setAttribute("role", "button");
    document.body.appendChild(element);
    expect(getLandmarkRole(element)).toBeUndefined();
  });

  test("has explicit landkmark role", () => {
    LANDMARK_ROLES.forEach((role) => {
      const element = document.createElement("div");
      element.setAttribute("role", role);
      document.body.appendChild(element);
      expect(getLandmarkRole(element)).toBe(role);
    });
  });

  test("has multiple roles, last is landmark", () => {
    LANDMARK_ROLES.forEach((role) => {
      const element = document.createElement("div");
      element.setAttribute("role", `other ${role}`);
      document.body.appendChild(element);
      expect(getLandmarkRole(element)).toBe(role);
    });
  });

  describe("<aside>", () => {
    test("in body", () => {
      const element = document.createElement("aside");
      document.body.appendChild(element);
      expect(getLandmarkRole(element)).toBe("complementary");
    });

    SECTIONING_CONTENT_TAGS.forEach((tag) => {
      test(`in <${tag}> without accessible name`, () => {
        const section = document.createElement(tag);
        const element = document.createElement("aside");
        section.appendChild(element);
        document.body.appendChild(section);
        expect(getLandmarkRole(element)).toBeUndefined();
      });

      test(`in <${tag}> with accessible name`, () => {
        const section = document.createElement(tag);
        const element = document.createElement("aside");
        element.setAttribute("aria-label", "label");
        section.appendChild(element);
        document.body.appendChild(section);
        expect(getLandmarkRole(element)).toBe("complementary");
      });

      test(`in <${tag}> with explicit landmark role`, () => {
        const section = document.createElement("section");
        const element = document.createElement("aside");
        element.setAttribute("role", "complementary");
        section.appendChild(element);
        document.body.appendChild(section);
        expect(getLandmarkRole(element)).toBe("complementary");
      });
    });
  });

  describe("<footer>", () => {
    test("in body", () => {
      const element = document.createElement("footer");
      document.body.appendChild(element);
      expect(getLandmarkRole(element)).toBe("contentinfo");
    });

    test("in <main>", () => {
      const main = document.createElement("main");
      const element = document.createElement("footer");
      main.appendChild(element);
      document.body.appendChild(main);
      expect(getLandmarkRole(element)).toBeUndefined();
    });

    SECTIONING_CONTENT_TAGS.forEach((tag) => {
      test(`in <${tag}>`, () => {
        const section = document.createElement(tag);
        const element = document.createElement("footer");
        section.appendChild(element);
        document.body.appendChild(section);
        expect(getLandmarkRole(element)).toBeUndefined();
      });

      test(`in <${tag}> with accessible name`, () => {
        const section = document.createElement(tag);
        const element = document.createElement("footer");
        element.setAttribute("aria-label", "label");
        section.appendChild(element);
        document.body.appendChild(section);
        expect(getLandmarkRole(element)).toBeUndefined();
      });

      test(`in <${tag}> with explicit landmark role`, () => {
        const section = document.createElement("section");
        const element = document.createElement("footer");
        element.setAttribute("role", "contentinfo");
        section.appendChild(element);
        document.body.appendChild(section);
        expect(getLandmarkRole(element)).toBe("contentinfo");
      });
    });
  });

  describe("<form>", () => {
    test("in body", () => {
      const element = document.createElement("form");
      document.body.appendChild(element);
      expect(getLandmarkRole(element)).toBe("form");
    });

    SECTIONING_CONTENT_TAGS.forEach((tag) => {
      test(`in <${tag}>`, () => {
        const section = document.createElement(tag);
        const element = document.createElement("form");
        section.appendChild(element);
        document.body.appendChild(section);
        expect(getLandmarkRole(element)).toBe("form");
      });
    });
  });

  describe("<header>", () => {
    test("in body", () => {
      const element = document.createElement("header");
      document.body.appendChild(element);
      expect(getLandmarkRole(element)).toBe("banner");
    });
    test("in <main>", () => {
      const main = document.createElement("main");
      const element = document.createElement("header");
      main.appendChild(element);
      document.body.appendChild(main);
      expect(getLandmarkRole(element)).toBeUndefined();
    });

    SECTIONING_CONTENT_TAGS.forEach((tag) => {
      test(`in <${tag}>`, () => {
        const section = document.createElement(tag);
        const element = document.createElement("header");
        section.appendChild(element);
        document.body.appendChild(section);
        expect(getLandmarkRole(element)).toBeUndefined();
      });
      test(`in <${tag}> with accessible name`, () => {
        const section = document.createElement(tag);
        const element = document.createElement("header");
        element.setAttribute("aria-label", "label");
        section.appendChild(element);
        document.body.appendChild(section);
        expect(getLandmarkRole(element)).toBeUndefined();
      });
      test(`in <${tag}> with explicit landmark role`, () => {
        const section = document.createElement("section");
        const element = document.createElement("header");
        element.setAttribute("role", "banner");
        section.appendChild(element);
        document.body.appendChild(section);
        expect(getLandmarkRole(element)).toBe("banner");
      });
    });
  });

  describe("<main>", () => {
    test("in body", () => {
      const element = document.createElement("main");
      document.body.appendChild(element);
      expect(getLandmarkRole(element)).toBe("main");
    });

    SECTIONING_CONTENT_TAGS.forEach((tag) => {
      test(`in <${tag}>`, () => {
        const section = document.createElement(tag);
        const element = document.createElement("main");
        section.appendChild(element);
        document.body.appendChild(section);
        expect(getLandmarkRole(element)).toBe("main");
      });
    });
  });

  describe("<nav>", () => {
    test("in body", () => {
      const element = document.createElement("nav");
      document.body.appendChild(element);
      expect(getLandmarkRole(element)).toBe("navigation");
    });

    SECTIONING_CONTENT_TAGS.forEach((tag) => {
      test(`in <${tag}>`, () => {
        const section = document.createElement(tag);
        const element = document.createElement("nav");
        section.appendChild(element);
        document.body.appendChild(section);
        expect(getLandmarkRole(element)).toBe("navigation");
      });
    });
  });

  describe("<search>", () => {
    test("in body", () => {
      const element = document.createElement("search");
      document.body.appendChild(element);
      expect(getLandmarkRole(element)).toBe("search");
    });

    SECTIONING_CONTENT_TAGS.forEach((tag) => {
      test(`in <${tag}>`, () => {
        const section = document.createElement(tag);
        const element = document.createElement("search");
        section.appendChild(element);
        document.body.appendChild(section);
        expect(getLandmarkRole(element)).toBe("search");
      });
    });
  });

  describe("<section>", () => {
    test("in body without accessible name", () => {
      const element = document.createElement("section");
      document.body.appendChild(element);
      expect(getLandmarkRole(element)).toBeUndefined();
    });
    test("in body with accessible name", () => {
      const element = document.createElement("section");
      element.setAttribute("aria-label", "label");
      document.body.appendChild(element);
      expect(getLandmarkRole(element)).toBe("region");
    });
    test("in body with explicit landmark role", () => {
      const element = document.createElement("section");
      element.setAttribute("role", "region");
      document.body.appendChild(element);
      expect(getLandmarkRole(element)).toBe("region");
    });

    SECTIONING_CONTENT_TAGS.forEach((tag) => {
      test(`in <${tag}> without accessible name`, () => {
        const section = document.createElement(tag);
        const element = document.createElement("section");
        section.appendChild(element);
        document.body.appendChild(section);
        expect(getLandmarkRole(element)).toBeUndefined();
      });
      test(`in <${tag}> with accessible name`, () => {
        const section = document.createElement(tag);
        const element = document.createElement("section");
        element.setAttribute("aria-label", "label");
        section.appendChild(element);
        document.body.appendChild(section);
        expect(getLandmarkRole(element)).toBe("region");
      });
      test(`in <${tag}> with explicit landmark role`, () => {
        const section = document.createElement("section");
        const element = document.createElement("section");
        element.setAttribute("role", "region");
        section.appendChild(element);
        document.body.appendChild(section);
        expect(getLandmarkRole(element)).toBe("region");
      });
    });
  });
});
