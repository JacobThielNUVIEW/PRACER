export const TOKENS = {
  racDepth: '--rac-depth',
  racSurface: '--rac-surface',
  racBorder: '--rac-border',
  racBlue: '--rac-blue',
  racBlueGlow: '--rac-blue-glow',
  racSignal: '--rac-signal',
  racTextMain: '--rac-text-main',
  racTextMuted: '--rac-text-muted',
  racSuccess: '--rac-success',
  racWarning: '--rac-warning',
  racDanger: '--rac-danger',
  brandStrava: '--brand-strava',
  brandGarmin: '--brand-garmin',
  brandApple: '--brand-apple',
  brandNike: '--brand-nike',
  // aliases
  brandPrimary: '--brand-primary',
  primary: '--primary',
} as const;

export type TokenKey = keyof typeof TOKENS;

export const cssVar = (key: TokenKey) => {
  const name = TOKENS[key];
  return `var(${name})`;
};

export default TOKENS;
