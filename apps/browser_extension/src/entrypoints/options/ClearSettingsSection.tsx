import { createI18n } from "@wxt-dev/i18n";
import { useState } from "react";
import { Button } from "@/components/Button";
import { clearAllTextStyleSettings } from "@/storage";

const { t } = createI18n();

export const ClearSettingsSection = ({
  isExist,
  onExecuted,
}: {
  isExist: boolean;
  onExecuted?: () => Promise<void>;
}) => {
  const [isClearing, setIsClearing] = useState(false);
  const [clearedAt, setClearedAt] = useState<number>(0);

  const clearAllSettings = async () => {
    setIsClearing(true);
    await clearAllTextStyleSettings();
    await onExecuted?.();
    setIsClearing(false);
    setClearedAt(Date.now());
  };

  return (
    <section className="p-4 bg-white dark:bg-stone-800 rounded-xl border border-stone-300 dark:border-stone-600">
      <h2 className="text-lg font-bold text-stone-800 dark:text-stone-200 mb-2">
        {t("options.clearSettings")}
      </h2>
      <p className="text-base text-stone-700 dark:text-stone-300 mb-4">
        {t("options.clearingDescription")}
      </p>
      {isExist && (
        <Button
          appearance="secondary"
          onClick={clearAllSettings}
          disabled={isClearing}
        >
          {t("options.clearSettings")}
        </Button>
      )}
      <output>
        {!isExist && clearedAt > 0 && (
          <p className="text-sm text-stone-700 dark:text-stone-300 min-h-9 flex items-center">
            {t("options.clearedSettings")}
          </p>
        )}
      </output>
      {!isExist && clearedAt === 0 && (
        <p className="text-sm text-stone-700 dark:text-stone-300 min-h-9 flex items-center">
          {t("options.noSettings")}
        </p>
      )}
    </section>
  );
};
