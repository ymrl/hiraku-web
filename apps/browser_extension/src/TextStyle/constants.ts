export const TEXT_STYLE_SETTINGS = {
  fontSize: {
    min: 0.5,
    max: 4.0,
    step: 0.01,
  },
  lineHeight: {
    min: 0.5,
    max: 3.0,
    step: 0.01,
  },
  paragraphSpacing: {
    min: 1.0,
    max: 3.0,
    step: 0.1,
  },
  letterSpacing: {
    min: 0.0,
    max: 2.0,
    step: 0.01,
  },
  wordSpacing: {
    min: 0.0,
    max: 2.0,
    step: 0.01,
  },
} as const;
