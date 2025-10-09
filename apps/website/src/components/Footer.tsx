interface FooterProps {
  lang: "ja" | "en";
}

export function Footer({ lang }: FooterProps) {
  const isJapanese = lang === "ja";
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-stone-800 text-stone-300 py-8 mt-16">
      <div className="container mx-auto px-6 text-center">
        <p className="text-sm">
          &copy; {currentYear} {isJapanese ? "ひらくウェブ" : "Hiraku Web"}.{" "}
          {isJapanese ? "すべての権利を保有します。" : "All rights reserved."}
        </p>
      </div>
    </footer>
  );
}
