import { defineConfig } from "wxt";
import pkg from "./package.json";

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ["@wxt-dev/module-react", "@wxt-dev/i18n/module"],
  srcDir: "src",
  outDir: "dist",
  imports: false,
  zip: {
    artifactTemplate: "hiraku-web-{{version}}-{{browser}}.zip",
  },
  manifest: {
    name: "__MSG_extensionName__",
    description: "__MSG_extensionDescription__",
    version: pkg.version,
    default_locale: "en",
    permissions: ["storage", "activeTab", "contextMenus"],
    options_ui: {
      page: "options.html",
    },
    icons: {
      16: "icon/icon@16w.png",
      32: "icon/icon@32w.png",
      48: "icon/icon@48w.png",
      128: "icon/icon@128w.png",
    },
    browser_specific_settings: {
      gecko: {
        id: "hiraku-web@ymrl.net",
      },
    },
  },
});
