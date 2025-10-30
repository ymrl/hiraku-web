import { createI18n } from "@wxt-dev/i18n";
import { useId, useMemo, useState } from "react";
import { SettingSlider } from "@/components/SettingSlider";
import { Switch } from "@/components/Switch";
import { saveUserInterfaceSettings } from "@/storage";
import type { UserInterfaceSettings } from "@/types";

const { t } = createI18n();

const BUTTON_SIZE_OPTIONS = [
  "xsmall",
  "small",
  "medium",
  "large",
  "xlarge",
] as const;

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
    <section className="@container p-4 bg-white dark:bg-stone-800 rounded-xl border border-stone-300 dark:border-stone-600">
      <h2 className="text-lg font-bold text-stone-800 dark:text-stone-200 mb-2">
        {t("options.userInterface")}
      </h2>
      <div className="flex flex-row gap-4 justify-stretch flex-wrap">
        <div className="w-full @2xl:w-96 shrink-0 flex items-center">
          {/** biome-ignore lint/a11y/noStaticElementInteractions: only to support click the button */}
          {/** biome-ignore lint/a11y/useKeyWithClickEvents: only to support click the button */}
          <div
            className="flex items-center gap-2 w-fit"
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
              isOn={!!settings.showButtonOnPage}
              ariaLabelledBy={`${id}-showButtonOnPage-label`}
            />
            <span
              className="text-sm text-stone-700 dark:text-stone-300"
              id={`${id}-showButtonOnPage-label`}
            >
              {t("options.showButtonOnPage")}
            </span>
          </div>
        </div>
        <div className="w-full @2xl:w-96 shrink-0">
          <SettingSlider
            min={0.2}
            max={1}
            step={0.01}
            label={t("options.buttonOpacity")}
            value={settings.buttonOpacity ?? 0.5}
            status={settings.showButtonOnPage ? "active" : "inactive"}
            onChange={(v) => {
              const newSettings = {
                ...settings,
                buttonOpacity: v,
              };
              save(newSettings);
            }}
            unit="%"
            toDisplay={(v) => Math.round(v * 100)}
            fromDisplay={(v) => v / 100}
          />
        </div>
        <fieldset className="w-full @2xl:w-96">
          <legend className="block text-sm text-stone-700 dark:text-stone-300 mb-2">
            {t("options.buttonSize")}
          </legend>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {BUTTON_SIZE_OPTIONS.map((size) => (
              <label key={size} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="buttonSize"
                  value={size}
                  checked={settings.buttonSize === size}
                  disabled={!settings.showButtonOnPage}
                  onChange={(e) => {
                    const newSettings = {
                      ...settings,
                      buttonSize: e.target.value as typeof size,
                    };
                    save(newSettings);
                  }}
                  className="scale-125"
                />
                <span className="text-sm text-stone-700 dark:text-stone-300">
                  {t(`options.buttonSizes.${size}`)}
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      </div>
    </section>
  );
};
