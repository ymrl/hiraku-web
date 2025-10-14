import { useRef, useState } from "react";
import { getCurrentTabId } from "@/browser/getCurrentTabId";
import { LandmarksList } from "@/components/LandmarksList";
import { type GetLandmarks, sendMessageToTab } from "@/ExtensionMessages";
import type { Landmark } from "@/types";

const getLandmarks = async (): Promise<Landmark[]> => {
  try {
    const tabId = await getCurrentTabId();
    if (!tabId) {
      return [];
    }
    const response = await sendMessageToTab<GetLandmarks>(tabId, {
      action: "getLandmarks",
    });
    if (response?.landmarks) {
      return response.landmarks;
    }
    return [];
  } catch (err) {
    console.error("Failed to get landmarks from content script:", err);
    return [];
  }
};

export const LandmarksPanel = ({
  onScrollToElement,
}: {
  onScrollToElement: (xpaths: string[]) => void;
}) => {
  const [loading, setLoading] = useState(true);
  const [landmarks, setLandmarks] = useState<Landmark[]>([]);

  const load = async () => {
    const landmarks = await getLandmarks();
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
