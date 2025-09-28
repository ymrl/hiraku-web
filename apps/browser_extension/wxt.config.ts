import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ["@wxt-dev/module-react", "@wxt-dev/i18n/module"],
  srcDir: "src",
  imports: false,
  manifest: {
    name: "__MSG_extensionName__",
    description: "__MSG_extensionDescription__",
    version: "0.0.0",
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
