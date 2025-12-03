// Generated token exports — paste your color schema into colors.example.json and then update the values here or import the JSON.

export const colors = {
  racSlate900: '#0E0E0E',
  racSlate800: '#161616',
  racSlate700: '#262626',
  racSlate600: '#333333',
  racBlue: '#3DA5F5',
  racBlueLight: '#66B3FF',
  racWhite: '#F0F0F0',
  racGrayLight: '#A0A0A0',
  racOrange: '#FC4C02',
  gold400: '#fbbf24',
  gold500: '#f59e0b',
  gold600: '#d97706',
  gold: '#f59e0b',

  stravaOrange: '#FC4C02',
  stravaDark: '#111111',
  stravaGray: '#999999',

  appleGreen: '#34C759',
  appleGray: '#E5E5EA',

  googleBlue: '#4285F4',
  googleGreen: '#34A853',
  googleYellow: '#FBBC05',
  googleRed: '#EA4335',

  garminBlue: '#00A3E0',
  garminGray: '#5A5A5A',

  nikeRed: '#FF0000',
  nikeGray: '#333333',

  textPrimary: '#F0F0F0',
  textSecondary: '#A0A0A0',
  textAccent: '#3DA5F5',
  textAccentAlt: '#FC4C02',

  btnPrimaryBg: '#3DA5F5',
  btnPrimaryHover: '#66B3FF',
  btnSecondaryBg: '#262626',
  btnSecondaryHover: '#333333',
  btnStravaBg: '#FC4C02',
  btnStravaHover: '#FF6B2B',
  btnDisabled: '#444444',

  navBg: '#161616',
  navBorder: '#262626',
  navItemActiveBorder: '#FC4C02',
  navItemHoverBg: '#262626',

  chartPrimary: '#FC4C02',
  chartSecondary: '#3DA5F5',
  chartAccent: '#66B3FF',
  chartBg: '#0E0E0E',
  silver400: '#e5e7eb',
  silver500: '#cfd8dc',
  silver600: '#b0b6be',
  silver: '#cfd8dc',

  glowBlue: 'rgba(62,165,245,0.2)',
} as const;

export type Colors = typeof colors;

export default colors;

function toKebabCase(key: string) {
  // convert camelCase to kebab-case: racSlate900 -> rac-slate-900
  return key.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

export function cssVar(key: keyof Colors) {
  return `var(--${toKebabCase(key as string)})`;
}
