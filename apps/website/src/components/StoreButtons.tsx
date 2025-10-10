interface StoreButtonsProps {
  lang: "ja" | "en";
}

export function StoreButtons({ lang }: StoreButtonsProps) {
  const isJapanese = lang === "ja";

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
      <a
        href="https://chromewebstore.google.com/detail/hiraku-web/eecleafcjhjbjlfaekfcjgmhighempei"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-rose-500 hover:bg-rose-600 text-white font-semibold py-4 px-8 rounded-full shadow-lg transition-all hover:shadow-xl hover:scale-105"
      >
        {isJapanese ? "Chrome ウェブストア" : "Chrome Web Store"}
      </a>
      <a
        href="https://addons.mozilla.org/ja/firefox/addon/hiraku-web/"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-rose-500 hover:bg-rose-600 text-white font-semibold py-4 px-8 rounded-full shadow-lg transition-all hover:shadow-xl hover:scale-105"
      >
        {isJapanese ? "Firefox アドオン" : "Edge Addons"}
      </a>
      <a
        href="https://microsoftedge.microsoft.com/addons/detail/hmndnicgmlbohjhbehganhldmjbhjgod"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-rose-500 hover:bg-rose-600 text-white font-semibold py-4 px-8 rounded-full shadow-lg transition-all hover:shadow-xl hover:scale-105"
      >
        {isJapanese ? "Edge アドオン" : "Edge Addons"}
      </a>
    </div>
  );
}
