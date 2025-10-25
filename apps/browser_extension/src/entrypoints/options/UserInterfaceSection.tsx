import { createI18n } from "@wxt-dev/i18n";
import { useId, useMemo, useState } from "react";
import { Switch } from "@/components/Switch";
import { saveUserInterfaceSettings } from "@/storage";
import type { UserInterfaceSettings } from "@/types";

const { t } = createI18n();
export const UserInterfaceSection = ({
  userInterfaceSettings,
  onSave,
}: {
  userInterfaceSettings: UserInterfaceSettings;
  onSave: (settings: UserInterfaceSettings) => void;
}) => {
  const [settings, setSettings] = useState<UserInterfaceSettings>(
    userInterfaceSettings,
  );
  useMemo(() => {
    setSettings(userInterfaceSettings);
  }, [userInterfaceSettings]);

  const save = async (newSettings: UserInterfaceSettings) => {
    setSettings(newSettings);
    await saveUserInterfaceSettings(newSettings);
    onSave(newSettings);
  };
  const id = useId();

  return (
    <section className="p-4 bg-white dark:bg-stone-800 rounded-xl border border-stone-300 dark:border-stone-600">
      <h2 className="text-lg font-bold text-stone-800 dark:text-stone-200 mb-2">
        {t("options.userInterface")}
      </h2>
      {/** biome-ignore lint/a11y/noStaticElementInteractions: only to support click the button */}
      {/** biome-ignore lint/a11y/useKeyWithClickEvents: only to support click the button */}
      <div
        className="flex items-center gap-2"
        onClick={(e) => {
          if ("tagName" in e.target && e.target.tagName === "BUTTON") {
            return;
          }
          const event = new MouseEvent("click", {
            bubbles: true,
            cancelable: true,
          });
          const switchElement = e.currentTarget.querySelector("button");
          switchElement?.dispatchEvent(event);
        }}
      >
        <Switch
          onToggle={(v) => {
            const newSettings = {
              ...settings,
              showButtonOnPage: v,
            };
            save(newSettings);
          }}
          isOn={settings.showButtonOnPage}
          ariaLabelledBy={`${id}-showButtonOnPage-label`}
        />
        <span
          className="text-sm text-stone-700 dark:text-stone-300"
          id={`${id}-showButtonOnPage-label`}
        >
          {t("options.showButtonOnPage")}
        </span>
      </div>
    </section>
  );
};
