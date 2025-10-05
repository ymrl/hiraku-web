import { beforeEach, describe, expect, test } from "vitest";
import { getLandmarks } from "./getLandmarks";

describe("getLandmarks", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  test("no landmarks", () => {
    expect(getLandmarks()).toEqual([]);
  });

  test("basic semantic landmarks", () => {
    document.body.innerHTML = `
      <header>Site Header</header>
      <nav>Navigation Menu</nav>
      <main>Main Content</main>
      <aside>Sidebar Content</aside>
      <footer>Site Footer</footer>
    `;
    const landmarks = getLandmarks();
    expect(landmarks).toEqual([
      {
        role: "banner",
        label: "",
        tag: "header",
        xpaths: ["/html/body/header"],
      },
      { role: "navigation", label: "", tag: "nav", xpaths: ["/html/body/nav"] },
      { role: "main", label: "", tag: "main", xpaths: ["/html/body/main"] },
      {
        role: "complementary",
        label: "",
        tag: "aside",
        xpaths: ["/html/body/aside"],
      },
      {
        role: "contentinfo",
        label: "",
        tag: "footer",
        xpaths: ["/html/body/footer"],
      },
    ]);
  });

  test("ARIA role landmarks", () => {
    document.body.innerHTML = `
      <div role="banner">Custom Header</div>
      <div role="navigation">Custom Nav</div>
      <div role="main">Custom Main</div>
      <div role="complementary">Custom Sidebar</div>
      <div role="contentinfo">Custom Footer</div>
      <div role="search">Search Area</div>
      <div role="form">Contact Form</div>
    `;
    const landmarks = getLandmarks();
    expect(landmarks).toEqual([
      { role: "banner", label: "", tag: "div", xpaths: ["/html/body/div[1]"] },
      {
        role: "navigation",
        label: "",
        tag: "div",
        xpaths: ["/html/body/div[2]"],
      },
      { role: "main", label: "", tag: "div", xpaths: ["/html/body/div[3]"] },
      {
        role: "complementary",
        label: "",
        tag: "div",
        xpaths: ["/html/body/div[4]"],
      },
      {
        role: "contentinfo",
        label: "",
        tag: "div",
        xpaths: ["/html/body/div[5]"],
      },
      { role: "search", label: "", tag: "div", xpaths: ["/html/body/div[6]"] },
      { role: "form", label: "", tag: "div", xpaths: ["/html/body/div[7]"] },
    ]);
  });

  test("section elements with labels become region landmarks", () => {
    document.body.innerHTML = `
      <section aria-label="User Profile">Profile content</section>
      <section aria-labelledby="section-heading">
        <h2 id="section-heading">Article Section</h2>
        Section content
      </section>
      <div role="region" aria-label="Related Articles">Related content</div>
    `;
    const landmarks = getLandmarks();
    expect(landmarks).toEqual([
      {
        role: "region",
        label: "User Profile",
        tag: "section",
        xpaths: ["/html/body/section[1]"],
      },
      {
        role: "region",
        label: "Article Section",
        tag: "section",
        xpaths: ["/html/body/section[2]"],
      },
      {
        role: "region",
        label: "Related Articles",
        tag: "div",
        xpaths: ["/html/body/div"],
      },
    ]);
  });

  test("section elements without labels should be excluded", () => {
    document.body.innerHTML = `
      <section>Content without label</section>
      <section aria-label="Labeled Section">Labeled content</section>
      <section>Another unlabeled section</section>
    `;
    const landmarks = getLandmarks();
    expect(landmarks).toEqual([
      {
        role: "region",
        label: "Labeled Section",
        tag: "section",
        xpaths: ["/html/body/section[2]"],
      },
    ]);
  });

  test("aria-hidden landmarks should be excluded", () => {
    document.body.innerHTML = `
      <header>Visible Header</header>
      <nav aria-hidden="true">Hidden Navigation</nav>
      <main>Visible Main</main>
      <div role="banner" aria-hidden="true">Hidden Banner</div>
    `;
    const landmarks = getLandmarks();
    expect(landmarks).toEqual([
      {
        role: "banner",
        label: "",
        tag: "header",
        xpaths: ["/html/body/header"],
      },
      { role: "main", label: "", tag: "main", xpaths: ["/html/body/main"] },
    ]);
  });

  test("landmarks inside aria-hidden containers should be excluded", () => {
    document.body.innerHTML = `
      <header>Visible Header</header>
      <div aria-hidden="true">
        <nav>Hidden Navigation</nav>
        <main>Hidden Main</main>
      </div>
      <footer>Visible Footer</footer>
    `;
    const landmarks = getLandmarks();
    expect(landmarks).toEqual([
      {
        role: "banner",
        label: "",
        tag: "header",
        xpaths: ["/html/body/header"],
      },
      {
        role: "contentinfo",
        label: "",
        tag: "footer",
        xpaths: ["/html/body/footer"],
      },
    ]);
  });

  test("display:none landmarks should be excluded", () => {
    document.body.innerHTML = `
      <header>Visible Header</header>
      <nav style="display: none">Hidden Navigation</nav>
      <main style="display:none;">Hidden Main</main>
      <footer>Visible Footer</footer>
    `;
    const landmarks = getLandmarks();
    expect(landmarks).toEqual([
      {
        role: "banner",
        label: "",
        tag: "header",
        xpaths: ["/html/body/header"],
      },
      {
        role: "contentinfo",
        label: "",
        tag: "footer",
        xpaths: ["/html/body/footer"],
      },
    ]);
  });

  test("visibility:hidden landmarks should be excluded", () => {
    document.body.innerHTML = `
      <header>Visible Header</header>
      <nav style="visibility: hidden">Hidden Navigation</nav>
      <main style="visibility:hidden;">Hidden Main</main>
      <footer>Visible Footer</footer>
    `;
    const landmarks = getLandmarks();
    expect(landmarks).toEqual([
      {
        role: "banner",
        label: "",
        tag: "header",
        xpaths: ["/html/body/header"],
      },
      {
        role: "contentinfo",
        label: "",
        tag: "footer",
        xpaths: ["/html/body/footer"],
      },
    ]);
  });

  test("landmarks with accessible names computed from content", () => {
    document.body.innerHTML = `
      <nav>
        <h2>Main Navigation</h2>
        <ul><li><a href="/">Home</a></li></ul>
      </nav>
      <main>
        <h1>Page Title</h1>
        <p>Page content</p>
      </main>
      <aside>
        <h3>Related Links</h3>
        <ul><li><a href="/related">Related</a></li></ul>
      </aside>
    `;
    const landmarks = getLandmarks();
    expect(landmarks).toEqual([
      { role: "navigation", label: "", tag: "nav", xpaths: ["/html/body/nav"] },
      { role: "main", label: "", tag: "main", xpaths: ["/html/body/main"] },
      {
        role: "complementary",
        label: "",
        tag: "aside",
        xpaths: ["/html/body/aside"],
      },
    ]);
  });

  test("landmarks with aria-label", () => {
    document.body.innerHTML = `
      <nav aria-label="Primary Navigation">Navigation content</nav>
      <main aria-label="Main Content Area">Main content</main>
      <aside aria-label="Sidebar">Sidebar content</aside>
    `;
    const landmarks = getLandmarks();
    expect(landmarks).toEqual([
      {
        role: "navigation",
        label: "Primary Navigation",
        tag: "nav",
        xpaths: ["/html/body/nav"],
      },
      {
        role: "main",
        label: "Main Content Area",
        tag: "main",
        xpaths: ["/html/body/main"],
      },
      {
        role: "complementary",
        label: "Sidebar",
        tag: "aside",
        xpaths: ["/html/body/aside"],
      },
    ]);
  });

  test("landmarks with aria-labelledby", () => {
    document.body.innerHTML = `
      <nav aria-labelledby="nav-heading">
        <h2 id="nav-heading">Site Navigation</h2>
        <ul><li><a href="/">Home</a></li></ul>
      </nav>
      <main aria-labelledby="main-heading">
        <h1 id="main-heading">Article Title</h1>
        <p>Article content</p>
      </main>
    `;
    const landmarks = getLandmarks();
    expect(landmarks).toEqual([
      {
        role: "navigation",
        label: "Site Navigation",
        tag: "nav",
        xpaths: ["/html/body/nav"],
      },
      {
        role: "main",
        label: "Article Title",
        tag: "main",
        xpaths: ["/html/body/main"],
      },
    ]);
  });

  test("mixed visible and hidden landmarks", () => {
    document.body.innerHTML = `
      <header>Visible Header</header>
      <nav aria-hidden="true">Hidden Navigation</nav>
      <main>Visible Main</main>
      <aside style="display: none">Hidden Sidebar</aside>
      <div aria-hidden="true">
        <footer>Hidden Footer</footer>
      </div>
      <div role="search" aria-label="Site Search">Search Box</div>
      <section aria-label="Comments" style="visibility: hidden">Comments</section>
    `;
    const landmarks = getLandmarks();
    expect(landmarks).toEqual([
      {
        role: "banner",
        label: "",
        tag: "header",
        xpaths: ["/html/body/header"],
      },
      { role: "main", label: "", tag: "main", xpaths: ["/html/body/main"] },
      {
        role: "search",
        label: "Site Search",
        tag: "div",
        xpaths: ["/html/body/div[2]"],
      },
    ]);
  });

  test("non-landmark elements should be excluded", () => {
    document.body.innerHTML = `
      <div>Regular div</div>
      <span>Regular span</span>
      <article>Article content</article>
      <header>Valid Header</header>
      <p role="button">Button-like paragraph</p>
      <div role="tab">Tab element</div>
    `;
    const landmarks = getLandmarks();
    expect(landmarks).toEqual([
      {
        role: "banner",
        label: "",
        tag: "header",
        xpaths: ["/html/body/header"],
      },
    ]);
  });

  test("empty accessible names should still be included for non-section elements", () => {
    document.body.innerHTML = `
      <header></header>
      <nav></nav>
      <main></main>
      <aside></aside>
      <footer></footer>
      <section></section>
      <section aria-label=""></section>
      <section aria-label="Valid Section"></section>
    `;
    const landmarks = getLandmarks();
    expect(landmarks).toEqual([
      {
        role: "banner",
        label: "",
        tag: "header",
        xpaths: ["/html/body/header"],
      },
      { role: "navigation", label: "", tag: "nav", xpaths: ["/html/body/nav"] },
      { role: "main", label: "", tag: "main", xpaths: ["/html/body/main"] },
      {
        role: "complementary",
        label: "",
        tag: "aside",
        xpaths: ["/html/body/aside"],
      },
      {
        role: "contentinfo",
        label: "",
        tag: "footer",
        xpaths: ["/html/body/footer"],
      },
      {
        role: "region",
        label: "Valid Section",
        tag: "section",
        xpaths: ["/html/body/section[3]"],
      },
    ]);
  });

  test("landmarks in iframe", () => {
    document.body.innerHTML = `
      <header>Top Level Header</header>
      <iframe id="test-iframe"></iframe>
    `;
    const iframe = document.getElementById("test-iframe") as HTMLIFrameElement;
    const iframeDoc = iframe.contentDocument;
    if (iframeDoc) {
      iframeDoc.body.innerHTML = `
        <nav>Iframe Navigation</nav>
        <main>Iframe Main</main>
      `;
    }

    const landmarks = getLandmarks();
    expect(landmarks).toEqual([
      {
        role: "banner",
        label: "",
        tag: "header",
        xpaths: ["/html/body/header"],
      },
      {
        role: "navigation",
        label: "",
        tag: "nav",
        xpaths: ['//*[@id="test-iframe"]', "/html/body/nav"],
      },
      {
        role: "main",
        label: "",
        tag: "main",
        xpaths: ['//*[@id="test-iframe"]', "/html/body/main"],
      },
    ]);
  });

  test("landmarks in nested iframes", () => {
    document.body.innerHTML = `
      <header>Top Level</header>
      <iframe id="outer-iframe"></iframe>
    `;
    const outerIframe = document.getElementById(
      "outer-iframe",
    ) as HTMLIFrameElement;
    const outerDoc = outerIframe.contentDocument;
    if (outerDoc) {
      outerDoc.body.innerHTML = `
        <nav>Outer Navigation</nav>
        <iframe id="inner-iframe"></iframe>
      `;
      const innerIframe = outerDoc.getElementById(
        "inner-iframe",
      ) as HTMLIFrameElement;
      const innerDoc = innerIframe.contentDocument;
      if (innerDoc) {
        innerDoc.body.innerHTML = `
          <main>Inner Main</main>
        `;
      }
    }

    const landmarks = getLandmarks();
    expect(landmarks).toEqual([
      {
        role: "banner",
        label: "",
        tag: "header",
        xpaths: ["/html/body/header"],
      },
      {
        role: "navigation",
        label: "",
        tag: "nav",
        xpaths: ['//*[@id="outer-iframe"]', "/html/body/nav"],
      },
      {
        role: "main",
        label: "",
        tag: "main",
        xpaths: [
          '//*[@id="outer-iframe"]',
          '//*[@id="inner-iframe"]',
          "/html/body/main",
        ],
      },
    ]);
  });

  test("mixed top level and iframe landmarks", () => {
    document.body.innerHTML = `
      <header>Before Iframe</header>
      <iframe id="test-iframe"></iframe>
      <footer>After Iframe</footer>
    `;
    const iframe = document.getElementById("test-iframe") as HTMLIFrameElement;
    const iframeDoc = iframe.contentDocument;
    if (iframeDoc) {
      iframeDoc.body.innerHTML = `
        <main>Inside Iframe</main>
      `;
    }

    const landmarks = getLandmarks();
    expect(landmarks).toEqual([
      {
        role: "banner",
        label: "",
        tag: "header",
        xpaths: ["/html/body/header"],
      },
      {
        role: "contentinfo",
        label: "",
        tag: "footer",
        xpaths: ["/html/body/footer"],
      },
      {
        role: "main",
        label: "",
        tag: "main",
        xpaths: ['//*[@id="test-iframe"]', "/html/body/main"],
      },
    ]);
  });

  test("hidden landmarks in iframe should be excluded", () => {
    document.body.innerHTML = `
      <header>Top Level</header>
      <iframe id="test-iframe"></iframe>
    `;
    const iframe = document.getElementById("test-iframe") as HTMLIFrameElement;
    const iframeDoc = iframe.contentDocument;
    if (iframeDoc) {
      iframeDoc.body.innerHTML = `
        <nav>Visible Navigation</nav>
        <main aria-hidden="true">Hidden Main</main>
        <aside style="display: none">Hidden Aside</aside>
      `;
    }

    const landmarks = getLandmarks();
    expect(landmarks).toEqual([
      {
        role: "banner",
        label: "",
        tag: "header",
        xpaths: ["/html/body/header"],
      },
      {
        role: "navigation",
        label: "",
        tag: "nav",
        xpaths: ['//*[@id="test-iframe"]', "/html/body/nav"],
      },
    ]);
  });

  test("landmarks with labels in iframe", () => {
    document.body.innerHTML = `
      <header>Top Level</header>
      <iframe id="test-iframe"></iframe>
    `;
    const iframe = document.getElementById("test-iframe") as HTMLIFrameElement;
    const iframeDoc = iframe.contentDocument;
    if (iframeDoc) {
      iframeDoc.body.innerHTML = `
        <nav aria-label="Primary Navigation">Nav Content</nav>
        <section aria-label="Featured Content">Section Content</section>
      `;
    }

    const landmarks = getLandmarks();
    expect(landmarks).toEqual([
      {
        role: "banner",
        label: "",
        tag: "header",
        xpaths: ["/html/body/header"],
      },
      {
        role: "navigation",
        label: "Primary Navigation",
        tag: "nav",
        xpaths: ['//*[@id="test-iframe"]', "/html/body/nav"],
      },
      {
        role: "region",
        label: "Featured Content",
        tag: "section",
        xpaths: ['//*[@id="test-iframe"]', "/html/body/section"],
      },
    ]);
  });
});
