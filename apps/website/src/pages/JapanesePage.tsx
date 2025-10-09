import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { StoreButtons } from "../components/StoreButtons";

export function JapanesePage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-rose-50 to-rose-100">
      <Header lang="ja" />

      <main className="flex-1 container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <section className="text-center mb-16">
            <h2 className="text-5xl font-bold text-rose-600 mb-6">
              読みやすいウェブへ
            </h2>
            <p className="text-xl text-stone-700 leading-relaxed">
              ウェブページをもっと快適に。
              <br />
              目次を作ったり、文字の大きさや間隔を調節したり。
              <br />
              あなたの読みやすさに合わせて、ウェブを「ひらく」拡張機能です。
            </p>
          </section>

          {/* Features Section */}
          <section className="bg-white rounded-3xl shadow-xl p-8 md:p-12 mb-12">
            <h3 className="text-3xl font-bold text-rose-600 mb-8 text-center">
              主な機能
            </h3>

            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-rose-500 text-white rounded-full flex items-center justify-center text-2xl font-bold">
                  1
                </div>
                <div>
                  <h4 className="text-xl font-bold text-stone-800 mb-2">
                    目次を作る
                  </h4>
                  <p className="text-stone-600 leading-relaxed">
                    長いページでも、目次が自動で表示されます。読みたいところにすぐジャンプできるので、必要な情報を素早く見つけられます。
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-rose-500 text-white rounded-full flex items-center justify-center text-2xl font-bold">
                  2
                </div>
                <div>
                  <h4 className="text-xl font-bold text-stone-800 mb-2">
                    文字を読みやすく調節
                  </h4>
                  <p className="text-stone-600 leading-relaxed">
                    文字の大きさ、行の間隔、段落の間隔、文字の間隔、単語の間隔を自由に調節できます。あなたにぴったりの読みやすさを見つけてください。
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-rose-500 text-white rounded-full flex items-center justify-center text-2xl font-bold">
                  3
                </div>
                <div>
                  <h4 className="text-xl font-bold text-stone-800 mb-2">
                    音声読み上げ
                  </h4>
                  <p className="text-stone-600 leading-relaxed">
                    ページの内容を音声で読み上げます。目を休めたいときや、手が離せないときに便利です。
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Download Section */}
          <section className="text-center">
            <h3 className="text-3xl font-bold text-rose-600 mb-6">
              今すぐダウンロード
            </h3>
            <p className="text-stone-700 mb-8">
              Chrome、Firefoxに対応しています。
              <br />
              無料でご利用いただけます。
            </p>
            <StoreButtons lang="ja" />
          </section>
        </div>
      </main>

      <Footer lang="ja" />
    </div>
  );
}
