import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { JapanesePage } from "./pages/JapanesePage";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element not found");

createRoot(rootElement).render(
  <StrictMode>
    <JapanesePage />
  </StrictMode>,
);
