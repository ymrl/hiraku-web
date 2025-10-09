interface HeaderProps {
  lang: "ja" | "en";
}

export function Header({ lang }: HeaderProps) {
  const isJapanese = lang === "ja";

  return (
    <header className="bg-rose-200 text-rose-600 py-2 shadow">
      <div className="container mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <img
            src="/hiraku-web/icon.svg"
            alt=""
            className="w-10 h-10"
            aria-hidden="true"
          />
          <hgroup className="flex-col gap-0">
            <h1 className="text-2xl font-light tracking-wider">
              {isJapanese ? "ひらくウェブ" : "Hiraku Web"}
            </h1>
            <p className="text-base font-light tracking-wide leading-4">
              {isJapanese ? "Hiraku Web" : "ひらくウェブ"}
            </p>
          </hgroup>
        </div>
        <a
          href={isJapanese ? "./en" : "./"}
          className="text-sm hover:underline bg-white/30 px-4 py-2 rounded-full transition-colors hover:bg-white/50"
        >
          {isJapanese ? "English" : "日本語"}
        </a>
      </div>
    </header>
  );
}
