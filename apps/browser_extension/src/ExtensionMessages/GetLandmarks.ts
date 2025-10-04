import type { Landmark } from "@/types";

export type GetLandmarks = {
  action: "getLandmarks";
};

export type GetLandmarksResponse = {
  action: "getLandmarks";
  landmarks: Landmark[];
};
