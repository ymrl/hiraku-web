import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig(({ command }) => {
  const isDev = command === "serve";

  return {
    plugins: [react(), tailwindcss()],
    base: "/hiraku-web/",
    build: isDev
      ? {}
      : {
          rollupOptions: {
            input: {
              css: resolve(__dirname, "src/build-css.ts"),
            },
            output: {
              assetFileNames: "assets/[name].[ext]",
              entryFileNames: "assets/[name].js",
            },
          },
        },
  };
});
