import { beforeEach, describe, expect, test } from "vitest";
import { getHeadings } from "./getHeadings";

describe("getHeadings", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  test("no headings", () => {
    expect(getHeadings()).toEqual([]);
  });

  test("basic headings", () => {
    document.body.innerHTML = `
      <h1>Heading 1</h1>
      <h2>Heading 2</h2>
      <h3>Heading 3</h3>
      <h4>Heading 4</h4>
      <h5>Heading 5</h5>
      <h6>Heading 6</h6>
    `;
    const headings = getHeadings();
    expect(headings).toEqual([
      { level: 1, text: "Heading 1", xpath: "/html/body/h1" },
      { level: 2, text: "Heading 2", xpath: "/html/body/h2" },
      { level: 3, text: "Heading 3", xpath: "/html/body/h3" },
      { level: 4, text: "Heading 4", xpath: "/html/body/h4" },
      { level: 5, text: "Heading 5", xpath: "/html/body/h5" },
      { level: 6, text: "Heading 6", xpath: "/html/body/h6" },
    ]);
  });

  test("ARIA role headings", () => {
    document.body.innerHTML = `
      <div role="heading" aria-level="1">ARIA Heading 1</div>
      <div role="heading" aria-level="3">ARIA Heading 3</div>
      <div role="heading">Default Level Heading</div>
      <span role="heading" aria-level="5">Span Heading</span>
    `;
    const headings = getHeadings();
    expect(headings).toEqual([
      { level: 1, text: "ARIA Heading 1", xpath: "/html/body/div[1]" },
      { level: 3, text: "ARIA Heading 3", xpath: "/html/body/div[2]" },
      { level: 2, text: "Default Level Heading", xpath: "/html/body/div[3]" },
      { level: 5, text: "Span Heading", xpath: "/html/body/span" },
    ]);
  });

  test("aria-hidden elements should be excluded", () => {
    document.body.innerHTML = `
      <h1>Visible Heading 1</h1>
      <h2 aria-hidden="true">Hidden Heading 2</h2>
      <div role="heading" aria-level="3" aria-hidden="true">Hidden ARIA Heading</div>
      <h4>Visible Heading 4</h4>
    `;
    const headings = getHeadings();
    expect(headings).toEqual([
      { level: 1, text: "Visible Heading 1", xpath: "/html/body/h1" },
      { level: 4, text: "Visible Heading 4", xpath: "/html/body/h4" },
    ]);
  });

  test("elements inside aria-hidden containers should be excluded", () => {
    document.body.innerHTML = `
      <h1>Visible Heading</h1>
      <div aria-hidden="true">
        <h2>Hidden by parent</h2>
        <div role="heading" aria-level="3">Also hidden by parent</div>
      </div>
      <section aria-hidden="true">
        <h4>Hidden in section</h4>
      </section>
    `;
    const headings = getHeadings();
    expect(headings).toEqual([
      { level: 1, text: "Visible Heading", xpath: "/html/body/h1" },
    ]);
  });

  test("display:none elements should be excluded", () => {
    document.body.innerHTML = `
      <h1>Visible Heading</h1>
      <h2 style="display: none">Hidden by display none</h2>
      <h3 style="display:none;">Also hidden</h3>
      <div role="heading" style="display: none;">Hidden ARIA heading</div>
    `;
    const headings = getHeadings();
    expect(headings).toEqual([
      { level: 1, text: "Visible Heading", xpath: "/html/body/h1" },
    ]);
  });

  test("visibility:hidden elements should be excluded", () => {
    document.body.innerHTML = `
      <h1>Visible Heading</h1>
      <h2 style="visibility: hidden">Hidden by visibility</h2>
      <h3 style="visibility:hidden;">Also hidden</h3>
    `;
    const headings = getHeadings();
    expect(headings).toEqual([
      { level: 1, text: "Visible Heading", xpath: "/html/body/h1" },
    ]);
  });

  test("empty text headings should be excluded", () => {
    document.body.innerHTML = `
      <h1>Visible Heading</h1>
      <h2></h2>
      <h3>   </h3>
      <div role="heading" aria-level="4"></div>
      <h5>Valid Heading</h5>
    `;
    const headings = getHeadings();
    expect(headings).toEqual([
      { level: 1, text: "Visible Heading", xpath: "/html/body/h1" },
      { level: 5, text: "Valid Heading", xpath: "/html/body/h5" },
    ]);
  });

  test("nested heading content", () => {
    document.body.innerHTML = `
      <h1>Heading with <span>nested</span> content</h1>
      <h2>
        <img alt="Icon" />
        Heading with image
      </h2>
      <div role="heading" aria-level="3">
        Complex <strong>nested</strong> <em>content</em>
      </div>
    `;
    const headings = getHeadings();
    expect(headings).toEqual([
      { level: 1, text: "Heading with nested content", xpath: "/html/body/h1" },
      { level: 2, text: "Heading with image", xpath: "/html/body/h2" },
      { level: 3, text: "Complex nested content", xpath: "/html/body/div" },
    ]);
  });

  test("mixed visible and hidden elements", () => {
    document.body.innerHTML = `
      <h1>Visible 1</h1>
      <h2 aria-hidden="true">Hidden by aria</h2>
      <h3>Visible 3</h3>
      <h4 style="display: none">Hidden by display</h4>
      <div role="heading" aria-level="2">Visible ARIA</div>
      <div aria-hidden="true">
        <h5>Hidden by parent</h5>
      </div>
      <h6 style="visibility: hidden">Hidden by visibility</h6>
    `;
    const headings = getHeadings();
    expect(headings).toEqual([
      { level: 1, text: "Visible 1", xpath: "/html/body/h1" },
      { level: 3, text: "Visible 3", xpath: "/html/body/h3" },
      { level: 2, text: "Visible ARIA", xpath: "/html/body/div[1]" },
    ]);
  });
});
