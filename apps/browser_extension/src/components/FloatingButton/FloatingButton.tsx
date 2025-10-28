import { createI18n } from "@wxt-dev/i18n";
import type { MouseEventHandler } from "react";
import { Button } from "@/components/Button";
import type { UserInterfaceSettings } from "@/types";
import { ButtonIcon } from "./ButtonIcon";

const { t } = createI18n();

interface FloatingButtonProps {
  onToggle: MouseEventHandler<HTMLButtonElement>;
  onClose: MouseEventHandler<HTMLButtonElement>;
  onHide: MouseEventHandler<HTMLButtonElement>;
  isOpen?: boolean;
  size?: UserInterfaceSettings["buttonSize"];
  opacity?: number;
}

export function FloatingButton({
  onToggle,
  onClose,
  onHide,
  isOpen,
  size = "medium",
  opacity = 0.5,
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
        style={{ opacity: isOpen ? 1 : opacity }}
        className={
          "p-2 grow-0 shrink-0 flex items-center justify-center transition-all duration-200 hover:scale-110"
        }
        title={t("extensionName")}
      >
        <ButtonIcon size={size} />
      </button>
    </div>
  );
}
