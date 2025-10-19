interface FooterProps {
  lang: "ja" | "en";
}

export function Footer({ lang }: FooterProps) {
  const isJapanese = lang === "ja";
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-stone-800 text-stone-300 py-8 mt-16">
      <ul className="container mx-auto px-6 text-center flex gap-4 flex-wrap items-center justify-center">
        <li className="text-sm">&copy; {currentYear} ymrl</li>
        <li className="text-sm">
          <a
            className="underline text-stone-300 hover:text-rose-300"
            href="https://github.com/ymrl/hiraku-web/blob/main/LICENSE.txt"
          >
            {isJapanese ? "MITライセンス" : "MIT License"}
          </a>
        </li>
        <li className="text-sm">
          <a
            className="underline text-stone-300 hover:text-rose-300"
            href="https://github.com/ymrl/hiraku-web/blob/main/PRIVACY.md"
          >
            {isJapanese ? "プライバシーポリシー" : "Privacy Policy"}
          </a>
        </li>
      </ul>
    </footer>
  );
}
