export const TEXT_STYLE_SETTINGS = {
  fontSize: {
    min: 0.5,
    max: 4.0,
    step: 0.01,
    defaultValue: 1.0,
  },
  lineHeight: {
    min: 0.5,
    max: 3.0,
    step: 0.01,
    defaultValue: 1.25,
  },
  paragraphSpacing: {
    min: 1.0,
    max: 3.0,
    step: 0.1,
    defaultValue: 1.0,
  },
  letterSpacing: {
    min: 0.0,
    max: 2.0,
    step: 0.01,
    defaultValue: 0.0,
  },
  wordSpacing: {
    min: 0.0,
    max: 2.0,
    step: 0.01,
    defaultValue: 0.0,
  },
} as const;
