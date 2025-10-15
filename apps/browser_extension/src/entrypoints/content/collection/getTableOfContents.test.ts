import { beforeEach, describe, expect, test } from "vitest";
import { getTableOfContents } from "./getTableOfContents";

describe("getTableOfContents", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  test("no content", () => {
    const toc = getTableOfContents();
    expect(toc.entries).toEqual([]);
    expect(toc.topLevelIndices).toEqual([]);
  });

  test("only headings (no landmarks)", () => {
    document.body.innerHTML = `
      <h1>Heading 1</h1>
      <h2>Heading 2</h2>
      <h3>Heading 3</h3>
    `;
    const toc = getTableOfContents();
    expect(toc.entries.length).toBe(3);
    expect(toc.entries.every((entry) => entry.type === "heading")).toBe(true);
    expect(toc.topLevelIndices).toEqual([0, 1, 2]);
  });

  test("only landmarks (no headings)", () => {
    document.body.innerHTML = `
      <header>Header</header>
      <nav aria-label="Main">Navigation</nav>
      <main>Main content</main>
      <footer>Footer</footer>
    `;
    const toc = getTableOfContents();
    expect(toc.entries.length).toBe(4);
    expect(toc.entries.every((entry) => entry.type === "landmark")).toBe(true);
    expect(toc.topLevelIndices.length).toBe(4);
  });

  test("heading inside landmark", () => {
    document.body.innerHTML = `
      <main>
        <h1>Page Title</h1>
        <h2>Section</h2>
      </main>
    `;
    const toc = getTableOfContents();

    // main landmark
    const mainEntry = toc.entries.find(
      (e) => e.type === "landmark" && e.role === "main",
    );
    expect(mainEntry).toBeDefined();
    expect(mainEntry?.type).toBe("landmark");

    // headings
    const h1Entry = toc.entries.find(
      (e) => e.type === "heading" && e.level === 1,
    );
    const h2Entry = toc.entries.find(
      (e) => e.type === "heading" && e.level === 2,
    );

    expect(h1Entry).toBeDefined();
    expect(h2Entry).toBeDefined();
    expect(h1Entry?.parentLandmarkIndex).toBeDefined();
    expect(h2Entry?.parentLandmarkIndex).toBeDefined();
  });

  test("nested landmarks", () => {
    document.body.innerHTML = `
      <main>
        <nav aria-label="Breadcrumb">
          <h2>Breadcrumb</h2>
        </nav>
      </main>
    `;
    const toc = getTableOfContents();

    const mainEntry = toc.entries.find(
      (e) => e.type === "landmark" && e.role === "main",
    );
    const navEntry = toc.entries.find(
      (e) => e.type === "landmark" && e.role === "navigation",
    );

    expect(mainEntry).toBeDefined();
    expect(navEntry).toBeDefined();
    expect(mainEntry?.type).toBe("landmark");
    expect(navEntry?.type).toBe("landmark");

    if (navEntry?.type === "landmark") {
      expect(navEntry.parentLandmarkIndex).toBeDefined();
      expect(navEntry.nestLevel).toBe(1);
    }

    if (mainEntry?.type === "landmark") {
      expect(mainEntry.nestLevel).toBe(0);
    }
  });

  test("complex real-world structure", () => {
    document.body.innerHTML = `
      <header>
        <nav aria-label="Main">
          <h2>Site Navigation</h2>
        </nav>
      </header>
      <main>
        <h1>Article Title</h1>
        <h2>Introduction</h2>
        <aside aria-label="Related">
          <h3>Related Articles</h3>
        </aside>
        <h2>Conclusion</h2>
      </main>
      <footer>
        <p>Footer content</p>
      </footer>
    `;
    const toc = getTableOfContents();

    // Verify landmarks exist
    const header = toc.entries.find(
      (e) => e.type === "landmark" && e.role === "banner",
    );
    const nav = toc.entries.find(
      (e) => e.type === "landmark" && e.role === "navigation",
    );
    const main = toc.entries.find(
      (e) => e.type === "landmark" && e.role === "main",
    );
    const aside = toc.entries.find(
      (e) => e.type === "landmark" && e.role === "complementary",
    );
    const footer = toc.entries.find(
      (e) => e.type === "landmark" && e.role === "contentinfo",
    );

    expect(header).toBeDefined();
    expect(nav).toBeDefined();
    expect(main).toBeDefined();
    expect(aside).toBeDefined();
    expect(footer).toBeDefined();

    // Verify nesting
    if (nav?.type === "landmark") {
      expect(nav.parentLandmarkIndex).toBeDefined();
      expect(nav.nestLevel).toBe(1);
    }

    if (aside?.type === "landmark") {
      expect(aside.parentLandmarkIndex).toBeDefined();
      expect(aside.nestLevel).toBe(1);
    }

    // Verify headings are associated with landmarks
    const h1 = toc.entries.find((e) => e.type === "heading" && e.level === 1);
    expect(h1?.type).toBe("heading");
    if (h1?.type === "heading") {
      expect(h1.parentLandmarkIndex).toBeDefined();
    }
  });

  test("headings not in any landmark", () => {
    document.body.innerHTML = `
      <h1>Heading outside landmark</h1>
      <div>
        <h2>Another heading</h2>
      </div>
      <main>
        <h3>Heading in main</h3>
      </main>
    `;
    const toc = getTableOfContents();

    const h1 = toc.entries.find((e) => e.type === "heading" && e.level === 1);
    const h2 = toc.entries.find((e) => e.type === "heading" && e.level === 2);
    const h3 = toc.entries.find((e) => e.type === "heading" && e.level === 3);

    expect(h1?.type).toBe("heading");
    expect(h2?.type).toBe("heading");
    expect(h3?.type).toBe("heading");

    if (h1?.type === "heading") {
      expect(h1.parentLandmarkIndex).toBeUndefined();
    }

    if (h2?.type === "heading") {
      expect(h2.parentLandmarkIndex).toBeUndefined();
    }

    if (h3?.type === "heading") {
      expect(h3.parentLandmarkIndex).toBeDefined();
    }
  });

  test("messy nesting (realistic scenario)", () => {
    // 実際のウェブページでは、ランドマークと見出しが
    // きれいな階層になっていないことがよくある
    document.body.innerHTML = `
      <h1>Page Title (before any landmark)</h1>
      <nav>
        <div>
          <h2>Navigation (in nav but nested in div)</h2>
        </div>
      </nav>
      <h2>Section outside any landmark</h2>
      <main>
        <div>
          <div>
            <h2>Deeply nested heading in main</h2>
          </div>
        </div>
        <aside>
          <h3>Aside heading</h3>
        </aside>
      </main>
    `;
    const toc = getTableOfContents();

    // 全てのエントリが取得されているか確認
    expect(toc.entries.length).toBeGreaterThan(0);

    // ランドマークの入れ子を確認
    const nav = toc.entries.find(
      (e) => e.type === "landmark" && e.role === "navigation",
    );
    const main = toc.entries.find(
      (e) => e.type === "landmark" && e.role === "main",
    );
    const aside = toc.entries.find(
      (e) => e.type === "landmark" && e.role === "complementary",
    );

    expect(nav).toBeDefined();
    expect(main).toBeDefined();
    expect(aside).toBeDefined();

    if (aside?.type === "landmark" && main) {
      // asideはmainの中にある
      expect(aside.parentLandmarkIndex).toBeDefined();
      expect(aside.nestLevel).toBe(1);
    }

    // 見出しの親ランドマークを確認
    const headings = toc.entries.filter((e) => e.type === "heading");
    expect(headings.length).toBe(5);
  });

  test("sibling landmarks at same level", () => {
    document.body.innerHTML = `
      <header>Header</header>
      <nav>Nav 1</nav>
      <nav>Nav 2</nav>
      <main>Main</main>
      <aside>Aside 1</aside>
      <aside>Aside 2</aside>
      <footer>Footer</footer>
    `;
    const toc = getTableOfContents();

    const landmarks = toc.entries.filter((e) => e.type === "landmark");
    expect(landmarks.length).toBe(7);

    // すべてトップレベル（nestLevel = 0）であることを確認
    landmarks.forEach((landmark) => {
      if (landmark.type === "landmark") {
        expect(landmark.nestLevel).toBe(0);
        expect(landmark.parentLandmarkIndex).toBeUndefined();
      }
    });
  });

  test("exclude option", () => {
    document.body.innerHTML = `
      <h1>Visible Heading</h1>
      <main>
        <h2>Main Heading</h2>
      </main>
      <div class="excluded">
        <h3>Excluded Heading</h3>
        <nav>Excluded Nav</nav>
      </div>
    `;
    const toc = getTableOfContents({ exclude: ".excluded" });

    // 除外されたコンテンツが含まれていないことを確認
    const excludedHeading = toc.entries.find(
      (e) => e.type === "heading" && e.text === "Excluded Heading",
    );
    expect(excludedHeading).toBeUndefined();

    // 表示されるべきコンテンツは含まれている
    const visibleHeading = toc.entries.find(
      (e) => e.type === "heading" && e.text === "Visible Heading",
    );
    expect(visibleHeading).toBeDefined();
  });

  test("hidden elements are excluded", () => {
    document.body.innerHTML = `
      <h1>Visible</h1>
      <h2 aria-hidden="true">Hidden by aria</h2>
      <main>
        <h3 style="display: none">Hidden by CSS</h3>
        <h4>Visible in main</h4>
      </main>
      <nav aria-hidden="true">
        <h5>Hidden nav</h5>
      </nav>
    `;
    const toc = getTableOfContents();

    // 隠された要素が含まれていないことを確認
    const hiddenByAria = toc.entries.find(
      (e) => e.type === "heading" && e.text === "Hidden by aria",
    );
    const hiddenByCss = toc.entries.find(
      (e) => e.type === "heading" && e.text === "Hidden by CSS",
    );
    const hiddenNav = toc.entries.find(
      (e) => e.type === "landmark" && e.role === "navigation",
    );

    expect(hiddenByAria).toBeUndefined();
    expect(hiddenByCss).toBeUndefined();
    expect(hiddenNav).toBeUndefined();

    // 表示される要素は含まれている
    const visible = toc.entries.find(
      (e) => e.type === "heading" && e.text === "Visible",
    );
    expect(visible).toBeDefined();
  });

  test("iframe content is included in DOM order", () => {
    document.body.innerHTML = `
      <h1>Before iframe</h1>
      <iframe id="test-iframe"></iframe>
      <h2>After iframe</h2>
    `;

    const iframe = document.getElementById("test-iframe") as HTMLIFrameElement;
    const iframeDoc = iframe.contentDocument;
    if (iframeDoc) {
      iframeDoc.body.innerHTML = `
        <h3>Heading in iframe</h3>
        <nav aria-label="Iframe nav">Nav in iframe</nav>
      `;
    }

    const toc = getTableOfContents();

    // DOM順序を確認
    const entries = toc.entries;
    const h1Index = entries.findIndex(
      (e) => e.type === "heading" && e.text === "Before iframe",
    );
    const h3Index = entries.findIndex(
      (e) => e.type === "heading" && e.text === "Heading in iframe",
    );
    const navIndex = entries.findIndex(
      (e) => e.type === "landmark" && e.role === "navigation",
    );
    const h2Index = entries.findIndex(
      (e) => e.type === "heading" && e.text === "After iframe",
    );

    // iframe内のコンテンツがDOM順序で表示されることを確認
    expect(h1Index).toBeLessThan(h3Index);
    expect(h3Index).toBeLessThan(navIndex);
    expect(navIndex).toBeLessThan(h2Index);
  });

  test("iframe content inherits parent landmark", () => {
    document.body.innerHTML = `
      <main>
        <h1>Main heading</h1>
        <iframe id="test-iframe"></iframe>
      </main>
    `;

    const iframe = document.getElementById("test-iframe") as HTMLIFrameElement;
    const iframeDoc = iframe.contentDocument;
    if (iframeDoc) {
      iframeDoc.body.innerHTML = `
        <h2>Iframe heading</h2>
        <nav aria-label="Iframe nav">Nav in iframe</nav>
      `;
    }

    const toc = getTableOfContents();

    // mainランドマークを探す
    const mainEntry = toc.entries.find(
      (e) => e.type === "landmark" && e.role === "main",
    );
    expect(mainEntry).toBeDefined();
    if (!mainEntry) return;

    const mainIndex = toc.entries.indexOf(mainEntry);

    // iframe内の見出しがmainを親として持つことを確認
    const iframeHeading = toc.entries.find(
      (e) => e.type === "heading" && e.text === "Iframe heading",
    );
    expect(iframeHeading).toBeDefined();
    expect(iframeHeading?.type).toBe("heading");
    if (iframeHeading?.type === "heading") {
      expect(iframeHeading.parentLandmarkIndex).toBe(mainIndex);
    }

    // iframe内のランドマークもmainを親として持つことを確認
    const iframeNav = toc.entries.find(
      (e) => e.type === "landmark" && e.role === "navigation",
    );
    expect(iframeNav).toBeDefined();
    expect(iframeNav?.type).toBe("landmark");
    if (iframeNav?.type === "landmark") {
      expect(iframeNav.parentLandmarkIndex).toBe(mainIndex);
      expect(iframeNav.nestLevel).toBe(1); // mainのnestLevel(0) + 1
    }
  });

  test("nested iframe with landmarks", () => {
    document.body.innerHTML = `
      <main>
        <h1>Main heading</h1>
        <aside>
          <h2>Aside heading</h2>
          <iframe id="test-iframe"></iframe>
        </aside>
      </main>
    `;

    const iframe = document.getElementById("test-iframe") as HTMLIFrameElement;
    const iframeDoc = iframe.contentDocument;
    if (iframeDoc) {
      iframeDoc.body.innerHTML = `
        <h3>Iframe heading in aside</h3>
        <section aria-label="Section">Section in iframe</section>
      `;
    }

    const toc = getTableOfContents();

    // asideランドマークを探す
    const asideEntry = toc.entries.find(
      (e) => e.type === "landmark" && e.role === "complementary",
    );
    expect(asideEntry).toBeDefined();
    expect(asideEntry?.type).toBe("landmark");
    if (!asideEntry) return;

    const asideIndex = toc.entries.indexOf(asideEntry);

    // asideのnestLevelを確認（mainの中なので1）
    if (asideEntry?.type === "landmark") {
      expect(asideEntry.nestLevel).toBe(1);
    }

    // iframe内の見出しがasideを親として持つことを確認
    const iframeHeading = toc.entries.find(
      (e) => e.type === "heading" && e.text === "Iframe heading in aside",
    );
    expect(iframeHeading).toBeDefined();
    if (iframeHeading?.type === "heading") {
      expect(iframeHeading.parentLandmarkIndex).toBe(asideIndex);
    }

    // iframe内のsectionランドマークがasideを親として持つことを確認
    const iframeSection = toc.entries.find(
      (e) =>
        e.type === "landmark" && e.role === "region" && e.label === "Section",
    );
    expect(iframeSection).toBeDefined();
    if (iframeSection?.type === "landmark") {
      expect(iframeSection.parentLandmarkIndex).toBe(asideIndex);
      expect(iframeSection.nestLevel).toBe(2); // asideのnestLevel(1) + 1
    }
  });

  test("iframe without parent landmark", () => {
    document.body.innerHTML = `
      <h1>Top heading</h1>
      <iframe id="test-iframe"></iframe>
    `;

    const iframe = document.getElementById("test-iframe") as HTMLIFrameElement;
    const iframeDoc = iframe.contentDocument;
    if (iframeDoc) {
      iframeDoc.body.innerHTML = `
        <h2>Iframe heading</h2>
        <main>Main in iframe</main>
      `;
    }

    const toc = getTableOfContents();

    // iframe内の見出しが親ランドマークを持たないことを確認
    const iframeHeading = toc.entries.find(
      (e) => e.type === "heading" && e.text === "Iframe heading",
    );
    expect(iframeHeading).toBeDefined();
    if (iframeHeading?.type === "heading") {
      expect(iframeHeading.parentLandmarkIndex).toBeUndefined();
    }

    // iframe内のmainランドマークもトップレベルであることを確認
    const iframeMain = toc.entries.find(
      (e) => e.type === "landmark" && e.role === "main",
    );
    expect(iframeMain).toBeDefined();
    if (iframeMain?.type === "landmark") {
      expect(iframeMain.parentLandmarkIndex).toBeUndefined();
      expect(iframeMain.nestLevel).toBe(0);
    }
  });
});
