export const Level = ({ level }: { level: number }) => {
  return (
    <span
      className="flex-shrink-0
            inline-flex items-center justify-center
            w-6 h-6 rounded overflow-hidden relative"
    >
      {level === 1 ? (
        <span
          className="absolute inset-0
               inline-flex items-center justify-center
               text-sm font-bold bg-rose-600 text-white"
        >
          {level}
        </span>
      ) : level === 2 ? (
        <span
          className="absolute inset-0
               inline-flex items-center justify-center
               text-sm font-bold bg-rose-200 dark:rose-800 text-stone-800 dark:text-stone-200"
        >
          {level}
        </span>
      ) : (
        <span
          className="
            inline-flex items-center justify-center
            w-5 h-5
            text-sm font-medium
            text-stone-500 dark:text-stone-300
            border border-rose-200 dark:border-rose-300 rounded"
        >
          {level}
        </span>
      )}
    </span>
  );
};
