import { createI18n } from "@wxt-dev/i18n";
import { useId } from "react";

const { t } = createI18n();

export const ButtonIcon = () => {
  const id = useId();
  return (
    <svg
      viewBox="0 0 44 44"
      fill="none"
      className="w-11 h-11 shadow-md shadow-black/10 dark:shadow-white/20 rounded-full"
    >
      <title>{t("extensionName")}</title>
      <circle cx="22" cy="22" r="22" fill={`url(#gradient-${id})`} />
      <path
        d="M28.6 6.92993V6.94347C28.7364 6.93449 28.8739 6.92993 29.0125 6.92993C32.4298 6.92993 35.2 9.70017 35.2 13.1174V34.1549C35.2 35.5218 34.092 36.6299 32.725 36.6299H11.275C9.90814 36.6299 8.80005 35.5218 8.80005 34.1549V13.1174C8.80005 9.70017 11.5703 6.92993 14.9875 6.92993C15.1262 6.92993 15.2637 6.93449 15.4 6.94347V6.92993H28.6Z"
        fill="#E11D48"
      />
      <path
        d="M8.80005 12.8376C8.80005 9.75716 11.5836 7.42484 14.6165 7.96402L23.279 9.50402C25.6415 9.92403 27.3625 11.978 27.3625 14.3776V30.8885C27.3625 32.0683 26.5298 33.084 25.3729 33.3154L11.7604 36.0379C10.2289 36.3442 8.80005 35.1728 8.80005 33.611V12.8376ZM23.8563 19.9237C22.8311 19.9237 22.0001 20.7548 22 21.78C22 22.8051 22.8311 23.6362 23.8563 23.6362C24.8815 23.6362 25.7125 22.8051 25.7125 21.78C25.7125 20.7548 24.8815 19.9237 23.8563 19.9237Z"
        fill="white"
      />
      <defs>
        <radialGradient
          id={`gradient-${id}`}
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(11.1513 9.46) rotate(50.3738) scale(33.7403)"
        >
          <stop stopColor="#FDA4AF" />
          <stop offset="1" stopColor="#FB7185" />
        </radialGradient>
      </defs>
    </svg>
  );
};
