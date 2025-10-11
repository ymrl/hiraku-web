import { createI18n } from "@wxt-dev/i18n";
import type { MouseEventHandler } from "react";
import { ButtonIcon } from "./ButtonIcon";

const { t } = createI18n();

interface FloatingButtonProps {
  onToggle: MouseEventHandler<HTMLButtonElement>;
  onClose: MouseEventHandler<HTMLButtonElement>;
  isOpen?: boolean;
}

export function FloatingButton({
  onToggle,
  onClose,
  isOpen,
}: FloatingButtonProps) {
  return (
    <div className="p-2 -mt-1 flex items-stretch">
      <button
        type="button"
        className="bg-transparent border-0 grow shrink"
        onClick={onClose}
        tabIndex={-1}
      >
        <span className="sr-only">{t("close")}</span>
      </button>
      <button
        type="button"
        onClick={onToggle}
        className={`p-0 rounded-full shadow-lg grow-0 shrink-0
          flex items-center justify-center transition-all duration-200 hover:scale-110 hover:opacity-100 ${
            isOpen ? "opacity-100" : "opacity-50"
          }`}
        title={t("extensionName")}
      >
        <ButtonIcon />
      </button>
    </div>
  );
}
