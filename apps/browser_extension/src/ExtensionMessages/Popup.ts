export type SelectHeadingsTab = {
  action: "selectHeadingsTab";
};
export type SelectHeadingsTabResponse = SelectHeadingsTab & {
  success: boolean;
};

export type SelectLandmarksTab = {
  action: "selectLandmarksTab";
};
export type SelectLandmarksTabResponse = SelectLandmarksTab & {
  success: boolean;
};

export type SelectTextTab = {
  action: "selectTextTab";
};
export type SelectTextTabResponse = SelectTextTab & {
  success: boolean;
};

export type SelectSpeechTab = {
  action: "selectSpeechTab";
};
export type SelectSpeechTabResponse = SelectSpeechTab & {
  success: boolean;
};
