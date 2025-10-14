import { createI18n } from "@wxt-dev/i18n";
import type { MouseEventHandler } from "react";
import { Button } from "@/components/Button";
import { ButtonIcon } from "./ButtonIcon";

const { t } = createI18n();

interface FloatingButtonProps {
  onToggle: MouseEventHandler<HTMLButtonElement>;
  onClose: MouseEventHandler<HTMLButtonElement>;
  onHide: MouseEventHandler<HTMLButtonElement>;
  isOpen?: boolean;
}

export function FloatingButton({
  onToggle,
  onClose,
  onHide,
  isOpen,
}: FloatingButtonProps) {
  return (
    <div className="flex items-stretch">
      {isOpen && (
        <>
          <div className="grow-0 shrink-0 ml-2 flex items-center">
            <Button appearance="secondary" onClick={onHide} size="small">
              {t("HideTemporarily")}
            </Button>
          </div>
          <button
            type="button"
            className="bg-transparent border-0 grow shrink basis-0"
            onClick={onClose}
            tabIndex={-1}
            aria-hidden="true"
          >
            <span className="sr-only">{t("close")}</span>
          </button>
        </>
      )}
      <button
        type="button"
        onClick={onToggle}
        aria-pressed={isOpen}
        className={`p-2 rounded-full grow-0 shrink-0
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
