import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { StoreButtons } from "../components/StoreButtons";

export function EnglishPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-rose-50 to-rose-100">
      <Header lang="en" />

      <main className="flex-1 container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <section className="text-center mb-16">
            <h2 className="text-5xl font-bold text-rose-600 mb-6 font-en">
              Make the Web More Readable
            </h2>
            <p className="text-xl text-stone-700 leading-relaxed font-en">
              Browse the web more comfortably.
              <br />
              Create a table of contents, adjust font size and spacing.
              <br />A browser extension that opens the web to your reading
              preferences.
            </p>
          </section>

          {/* Features Section */}
          <section className="bg-white rounded-3xl shadow-xl p-8 md:p-12 mb-12">
            <h2 className="text-3xl font-bold text-rose-600 mb-8 text-center font-en">
              Key Features
            </h2>

            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-bold text-stone-800 mb-2 font-en">
                  Create Table of Contents
                </h3>
                <p className="text-stone-600 leading-relaxed font-en">
                  Even on long pages, a table of contents is automatically
                  displayed. Jump to the section you want to read and quickly
                  find the information you need.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-stone-800 mb-2 font-en">
                  Adjust Text for Readability
                </h3>
                <p className="text-stone-600 leading-relaxed font-en">
                  Freely adjust font size, line height, paragraph spacing,
                  letter spacing, and word spacing. Find the perfect readability
                  for you.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-stone-800 mb-2 font-en">
                  Text-to-Speech
                </h3>
                <p className="text-stone-600 leading-relaxed font-en">
                  Read the page content aloud. Useful when you want to rest your
                  eyes or when your hands are busy.
                </p>
              </div>
            </div>
          </section>

          {/* Download Section */}
          <section className="text-center mb-12">
            <h2 className="text-3xl font-bold text-rose-600 mb-6 font-en">
              Download and Install
            </h2>
            <p className="text-stone-700 mb-8 font-en">
              Available for Google Chrome, Mozilla Firefox, and Microsoft Edge.
              <br />
              Free to use.
            </p>
            <StoreButtons lang="en" />
          </section>

          <section className="text-center">
            <h2 className="text-3xl font-bold text-rose-600 mb-6">
              Source Codes
            </h2>
            <p className="text-stone-700 mb-8">
              The source code for this browser extension is available on GitHub.
            </p>
            <a
              href="https://github.com/ymrl/hiraku-web"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-stone-600 hover:bg-stone-700 text-white font-semibold py-4 px-8 rounded-full shadow-lg transition-all hover:shadow-xl"
            >
              GitHub
            </a>
          </section>
        </div>
      </main>

      <Footer lang="en" />
    </div>
  );
}
