import { useCallback, useState } from "react";

export const useNavigation = () => {
  const [xpaths, setXpaths] = useState<string[]>([]);

  const updateXpaths = useCallback((newXpaths: string[]) => {
    setXpaths(newXpaths);
  }, []);

  return { xpaths, updateXpaths };
};
