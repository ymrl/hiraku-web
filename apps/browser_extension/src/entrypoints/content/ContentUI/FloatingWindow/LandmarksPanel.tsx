import { useRef, useState } from "react";
import { LandmarksList } from "@/components/LandmarksList";
import type { Landmark } from "@/types";
import { getLandmarks } from "../../collection";

export const LandmarksPanel = ({
  onScrollToElement,
}: {
  onScrollToElement: (xpaths: string[]) => void;
}) => {
  const [loading, setLoading] = useState(true);
  const [landmarks, setLandmarks] = useState<Landmark[]>([]);

  const load = async () => {
    const landmarks = await getLandmarks({
      exclude: "[data-hiraku-web-iframe-root]",
    });
    setLoading(false);
    setLandmarks(landmarks);
  };

  const loadedRef = useRef(false);
  if (!loadedRef.current) {
    loadedRef.current = true;
    load();
  }

  return (
    <LandmarksList
      onScrollToElement={onScrollToElement}
      landmarks={landmarks}
      loading={loading}
    />
  );
};
