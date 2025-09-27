/// <reference types="vitest" />
import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    target: ["es2022", "chrome89", "edge89"],
  },
  test: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    browser: {
      enabled: true,
      provider: "playwright",
      headless: true,
      screenshotFailures: false,
      instances: [
        {
          name: "chromium",
          browser: "chromium",
        },
        {
          name: "firefox",
          browser: "firefox",
        },
      ],
    },
  }
});