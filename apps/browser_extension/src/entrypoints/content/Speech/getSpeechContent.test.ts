import { afterEach, describe, expect, test } from "vitest";
import { getSpeechContent } from "./getSpeechContent";

describe("getSpeechContent", () => {
  afterEach(() => {
    document.body.innerHTML = "";
    document.head.innerHTML = "";
  });

  test("基本的なテキストノードを抽出", () => {
    const div = document.createElement("div");
    div.textContent = "Hello World";
    document.body.appendChild(div);

    expect(getSpeechContent(div)).toBe("Hello World");
  });

  test("空要素の場合は空文字を返す", () => {
    const div = document.createElement("div");
    document.body.appendChild(div);

    expect(getSpeechContent(div)).toBe("");
  });

  test("ネストした要素のテキストを連結", () => {
    const div = document.createElement("div");
    const span1 = document.createElement("span");
    const span2 = document.createElement("span");
    span1.textContent = "Hello";
    span2.textContent = "World";
    div.appendChild(span1);
    div.appendChild(span2);
    document.body.appendChild(div);

    expect(getSpeechContent(div)).toBe("HelloWorld");
  });

  test("display:noneの要素は無視される", () => {
    const style = document.createElement("style");
    style.textContent = `.hidden { display: none; }`;
    document.head.appendChild(style);

    const div = document.createElement("div");
    div.textContent = "Hidden content";
    div.className = "hidden";
    document.body.appendChild(div);

    expect(getSpeechContent(div)).toBe("");
  });

  test('aria-hidden="true"な要素は無視される', () => {
    const div = document.createElement("div");
    div.textContent = "Aria hidden content";
    div.setAttribute("aria-hidden", "true");
    document.body.appendChild(div);

    expect(getSpeechContent(div)).toBe("");
  });

  test("inputフィールドは値を含める", () => {
    const input = document.createElement("input") as HTMLInputElement;
    input.type = "text";
    input.value = "John Doe";
    input.setAttribute("aria-label", "Name field");
    document.body.appendChild(input);

    const result = getSpeechContent(input);
    expect(result).toContain("John Doe");
  });

  test("textareaフィールドは値を含める", () => {
    const textarea = document.createElement("textarea") as HTMLTextAreaElement;
    textarea.value = "Hello world";
    textarea.setAttribute("aria-label", "Message");
    document.body.appendChild(textarea);

    const result = getSpeechContent(textarea);
    expect(result).toContain("Hello world");
  });

  test("selectフィールドは選択オプションを含める", () => {
    const select = document.createElement("select") as HTMLSelectElement;
    const option1 = document.createElement("option");
    const option2 = document.createElement("option");

    option1.value = "ca";
    option1.textContent = "Canada";
    option1.selected = true;
    option2.value = "jp";
    option2.textContent = "Japan";

    select.appendChild(option1);
    select.appendChild(option2);
    document.body.appendChild(select);

    const result = getSpeechContent(select);
    expect(result).toContain("Canada");
  });

  test("svg要素の処理", () => {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("aria-label", "Chart icon");
    document.body.appendChild(svg);

    expect(getSpeechContent(svg)).toBe("Chart icon");
  });

  test("混合コンテンツ（インライン + ブロック）", () => {
    const div = document.createElement("div");
    const span = document.createElement("span");
    const p = document.createElement("p");

    span.textContent = "inline text";
    p.textContent = "block text";

    div.appendChild(span);
    div.appendChild(p);
    document.body.appendChild(div);

    expect(getSpeechContent(div)).toBe("inline textblock text");
  });

  test("プレゼンテーショナルロールの要素", () => {
    const button = document.createElement("button");
    button.textContent = "Click me";
    button.setAttribute("aria-label", "Submit button");
    document.body.appendChild(button);

    const result = getSpeechContent(button);
    expect(result).toContain("Submit button");
  });

  test("無視対象の要素は無視される", () => {
    const div = document.createElement("div");
    const script = document.createElement("script");
    const style = document.createElement("style");

    div.textContent = "Visible text";
    script.textContent = "console.log('Hello');";
    style.textContent = ".hidden { display: none; }";

    div.appendChild(script);
    div.appendChild(style);
    document.body.appendChild(div);

    expect(getSpeechContent(div)).toBe("Visible text");
  });

  test("visibility:hiddenの要素は無視される", () => {
    const style = document.createElement("style");
    style.textContent = `.invisible { visibility: hidden; }`;
    document.head.appendChild(style);

    const div = document.createElement("div");
    div.textContent = "Invisible content";
    div.className = "invisible";
    document.body.appendChild(div);

    expect(getSpeechContent(div)).toBe("");
  });

  test("hidden属性の要素は無視される", () => {
    const div = document.createElement("div");
    div.textContent = "Hidden with attribute";
    div.hidden = true;
    document.body.appendChild(div);

    expect(getSpeechContent(div)).toBe("");
  });

  test('aria-hidden="false"の要素は表示される', () => {
    const div = document.createElement("div");
    div.textContent = "Visible content";
    div.setAttribute("aria-hidden", "false");
    document.body.appendChild(div);

    expect(getSpeechContent(div)).toBe("Visible content");
  });

  test("親要素がaria-hiddenの場合、子要素も無視される", () => {
    const parent = document.createElement("div");
    parent.setAttribute("aria-hidden", "true");

    const child = document.createElement("div");
    child.textContent = "Child content";
    parent.appendChild(child);
    document.body.appendChild(parent);

    expect(getSpeechContent(child)).toBe("");
  });

  test("入れ子になった複雑な構造", () => {
    const article = document.createElement("article");
    const header = document.createElement("header");
    const h1 = document.createElement("h1");
    const nav = document.createElement("nav");
    const ul = document.createElement("ul");

    h1.textContent = "記事タイトル";
    nav.textContent = "ナビゲーション";

    header.appendChild(h1);
    article.appendChild(header);
    article.appendChild(nav);
    article.appendChild(ul);
    document.body.appendChild(article);

    expect(getSpeechContent(article)).toBe("記事タイトル ナビゲーション");
  });

  test("テキストノードとコメントノードの混在", () => {
    const div = document.createElement("div");
    div.appendChild(document.createTextNode("テキスト1"));
    div.appendChild(document.createComment("コメント"));
    div.appendChild(document.createTextNode("テキスト2"));
    document.body.appendChild(div);

    expect(getSpeechContent(div)).toBe("テキスト1テキスト2");
  });

  test("実際のinput要素でのラベル付け", () => {
    const label = document.createElement("label");
    label.textContent = "氏名:";

    const input = document.createElement("input") as HTMLInputElement;
    input.type = "text";
    input.value = "山田太郎";
    input.id = "name";
    label.htmlFor = "name";

    document.body.appendChild(label);
    document.body.appendChild(input);

    const result = getSpeechContent(input);
    expect(result).toContain("山田太郎");
  });

  test("detailsとsummaryの処理", () => {
    const details = document.createElement("details");
    const summary = document.createElement("summary");
    const content = document.createElement("div");

    summary.textContent = "詳細を表示";
    content.textContent = "隠れたコンテンツ";

    details.appendChild(summary);
    details.appendChild(content);
    document.body.appendChild(details);

    // detailsが閉じている状態ではcontentは無視される
    const closedResult = getSpeechContent(details);
    expect(closedResult).toContain("詳細を表示");

    // 開いた状態ではcontentも含まれる
    details.open = true;
    const openResult = getSpeechContent(details);
    expect(openResult).toContain("詳細を表示");
    expect(openResult).toContain("隠れたコンテンツ");
  });

  test("複数選択のselectフィールド", () => {
    const select = document.createElement("select") as HTMLSelectElement;
    select.multiple = true;

    const option1 = document.createElement("option");
    const option2 = document.createElement("option");
    const option3 = document.createElement("option");

    option1.value = "apple";
    option1.textContent = "Apple";
    option1.selected = true;

    option2.value = "banana";
    option2.textContent = "Banana";
    option2.selected = true;

    option3.value = "orange";
    option3.textContent = "Orange";

    select.appendChild(option1);
    select.appendChild(option2);
    select.appendChild(option3);
    document.body.appendChild(select);

    const result = getSpeechContent(select);
    expect(result).toContain("Apple");
    expect(result).toContain("Banana");
    expect(result).not.toContain("Orange");
  });
});
