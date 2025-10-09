interface HeaderProps {
  lang: "ja" | "en";
}

export function Header({ lang }: HeaderProps) {
  const isJapanese = lang === "ja";

  return (
    <header className="bg-gradient-to-r from-rose-500 to-rose-600 text-white py-6 shadow-lg">
      <div className="container mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <img
            src="/hiraku-web/icon.svg"
            alt=""
            className="w-10 h-10"
            aria-hidden="true"
          />
          <h1 className="text-3xl font-bold">
            {isJapanese ? "ひらくウェブ" : "Hiraku Web"}
          </h1>
        </div>
        <a
          href={isJapanese ? "./en" : "./"}
          className="text-sm hover:underline bg-white/20 px-4 py-2 rounded-full transition-colors hover:bg-white/30"
        >
          {isJapanese ? "English" : "日本語"}
        </a>
      </div>
    </header>
  );
}
