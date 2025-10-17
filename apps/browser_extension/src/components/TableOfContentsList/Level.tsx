export const Level = ({ level }: { level: number }) => {
  return (
    <span
      className={`flex-shrink-0 inline-flex items-center justify-center w-6 h-6 ${
        level <= 5 ? "p-0" : "p-0.5"
      }`}
    >
      <span
        className={`w-full h-full inline-flex items-center justify-center rounded-lg ${
          level <= 5 ? "text-base" : "text-xs"
        } ${level <= 3 ? "font-bold" : "font-medium"} ${
          level === 1
            ? "text-stone-900 dark:text-white"
            : level === 2
              ? "text-stone-800 dark:text-stone-200"
              : level === 3
                ? "text-stone-700 dark:text-stone-300"
                : level === 4
                  ? "text-stone-700 dark:text-stone-300"
                  : "text-stone-600 dark:text-stone-300"
        } ${
          level === 1
            ? "border-rose-400 dark:border-rose-500 border-2"
            : level === 2
              ? "border-rose-300 dark:border-rose-700 border-2"
              : level === 3
                ? "border-rose-200 dark:border-rose-800 border-2"
                : level === 4
                  ? "border-rose-300 dark:border-rose-800 border"
                  : "border-rose-200 dark:border-rose-800 border"
        }`}
      >
        {level}
      </span>
    </span>
  );
};
