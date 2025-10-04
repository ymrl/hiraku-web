export const SPEECH_SETTINGS = {
  rate: {
    min: 0.1,
    max: 3.0,
    step: 0.1,
  },
  pitch: {
    min: 0.0,
    max: 2.0,
    step: 0.1,
  },
  volume: {
    min: 0.0,
    max: 1.0,
    step: 0.1,
  },
} as const;
