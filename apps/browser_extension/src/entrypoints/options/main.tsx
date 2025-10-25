import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./style.css";
import { createI18n } from "@wxt-dev/i18n";

const { t } = createI18n();
document.title = t("options.pageTitle");

const root = document.getElementById("root");
if (root) {
  createRoot(root).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
