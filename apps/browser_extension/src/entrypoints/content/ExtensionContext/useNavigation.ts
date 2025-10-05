import { useCallback, useState } from "react";

export const useNavigation = () => {
  const [xpaths, setXpaths] = useState<string[]>([]);
  const [navigationTimestamp, setNavigationTimestamp] = useState(0);

  const updateXpaths = useCallback((newXpaths: string[]) => {
    setXpaths(newXpaths);
    setNavigationTimestamp(Date.now());
  }, []);

  return { xpaths, updateXpaths, navigationTimestamp };
};
