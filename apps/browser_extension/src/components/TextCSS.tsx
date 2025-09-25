import type { TextStyleSettings } from "../types";

export const TextCSS = ({ settings }: { settings: TextStyleSettings }) => {
  const { fontSize, lineHeight, paragraphSpacing, letterSpacing, wordSpacing } =
    settings;
  return (
    <style>
      {fontSize !== undefined && (
        <>
          :root {"{"}
          font-size: {(fontSize || 1) * 100}% !important;
          {"}"}
        </>
      )}
      {(lineHeight !== undefined ||
        letterSpacing !== undefined ||
        wordSpacing !== undefined) && (
        <>
          body, p, div, span, article, section, main, aside {"{"}
          {lineHeight !== undefined && (
            <>line-height: {lineHeight || 1.5} !important;</>
          )}
          {letterSpacing !== undefined && (
            <>letter-spacing: {letterSpacing || 0}em !important;</>
          )}
          {wordSpacing !== undefined && (
            <>word-spacing: {wordSpacing || 0}em !important;</>
          )}
          {"}"}
        </>
      )}
      {paragraphSpacing !== undefined && (
        <>
          p {"{"}
          margin-bottom: {settings.paragraphSpacing || 1}em !important;
          {"}"}p + p, div + p, section p, article p, main p {"{"}
          margin-top: {settings.paragraphSpacing || 1}em !important;
          {"}"}
        </>
      )}
    </style>
  );
};
