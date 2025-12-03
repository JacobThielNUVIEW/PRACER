export const TOKENS = {
  racDepth: '--rac-depth',
  racSurface: '--rac-surface',
  racBorder: '--rac-border',
  racBlue: '--rac-blue',
  racBlueGlow: '--rac-blue-glow',
  racOrange: '--rac-orange',
  racSignal: '--rac-signal',
  racTextMain: '--rac-text-main',
  racTextMuted: '--rac-text-muted',
  racSuccess: '--rac-success',
  racWarning: '--rac-warning',
  racDanger: '--rac-danger',
  racSlate900: '--rac-slate-900',
  racSlate800: '--rac-slate-800',
  racSlate700: '--rac-slate-700',
  brandStrava: '--brand-strava',
  brandGarmin: '--brand-garmin',
  brandApple: '--brand-apple',
  brandNike: '--brand-nike',
  // aliases
  brandPrimary: '--brand-primary',
  primary: '--primary',
  // gold palette (used by UI)
  gold: '--gold',
  'gold-400': '--gold-400',
  'gold-500': '--gold-500',
  'gold-600': '--gold-600',
} as const;

export type TokenKey = keyof typeof TOKENS;

export const cssVar = (key: TokenKey) => {
  const name = TOKENS[key];
  return `var(${name})`;
};

export default TOKENS;
