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
          &copy; {currentYear} ymrl{" "}
          <a
            className="underline text-stone-300 hover:text-rose-300"
            href="https://github.com/ymrl/hiraku-web"
          >
            {isJapanese ? "MITライセンス" : "MIT License"}
          </a>
        </p>
      </div>
    </footer>
  );
}
