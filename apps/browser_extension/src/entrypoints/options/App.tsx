import { createI18n } from "@wxt-dev/i18n";
import { useCallback, useEffect, useState } from "react";
import { browser } from "wxt/browser";

const { t } = createI18n();

function App() {
  const [isClearing, setIsClearing] = useState(false);
  const [savedKeys, setSavedKeys] = useState<string[]>([]);

  const loadSavedKeys = useCallback(async () => {
    setSavedKeys(await browser.storage.local.getKeys());
  }, []);

  useEffect(() => {
    loadSavedKeys();
  }, [loadSavedKeys]);

  const clearAllSettings = useCallback(async () => {
    try {
      setIsClearing(true);
      // すべての設定を削除
      await browser.storage.local.clear();
      await loadSavedKeys();
    } catch (err) {
      console.error("Failed to clear settings:", err);
    } finally {
      setIsClearing(false);
    }
  }, [loadSavedKeys]);

  return (
    <div className="min-h-screen bg-white dark:bg-stone-900 p-8">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-xl font-semibold text-stone-800 dark:text-stone-200 mb-4">
          {t("options.clearSettings")}
        </h2>

        <p className="text-stone-700 dark:text-stone-300 mb-6">
          {t("options.clearingDescription")}
        </p>

        {savedKeys.length > 0 ? (
          <button
            type="button"
            onClick={clearAllSettings}
            disabled={isClearing || savedKeys.length === 0}
            className="px-6 py-3 cursor-pointer disabled:cursor-not-allowed
              bg-rose-700 text-white rounded-lg
              hover:not-disabled:bg-rose-800 disabled:bg-stone-400
              dark:bg-rose-700 dark:not-disabled:hover:bg-rose-800
              transition-colors font-medium"
          >
            {t("options.clearSettings")}
          </button>
        ) : (
          <p className="text-stone-700 dark:text-stone-300">
            {t("options.noSettings")}
          </p>
        )}
      </div>
    </div>
  );
}

export default App;
