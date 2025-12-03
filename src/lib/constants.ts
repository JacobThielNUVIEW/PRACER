// src/lib/constants.ts
export const IMAGES = {
  hero: '/assets/images/hero.jpg',
  dashboardPreview: '/assets/images/dashboard-preview.jpg',
  features: {
    adaptive: '/assets/images/feature-1.jpg',
    analytics: '/assets/images/feature-2.jpg',
    results: '/assets/images/feature-3.jpg',
  },
  profile: '/assets/images/profile-avatar.jpg',
  heatmap: '/assets/images/activity-heatmap.jpg',
  activity: '/assets/images/activity-sample.jpg',
  logos: {
    strava: '/assets/images/strava-logo.webp',
    stravaDark: '/assets/images/strava-logo-dark.webp',
    garmin: '/assets/images/garmin-logo.webp',
    garminDark: '/assets/images/garmin-logo-dark.webp',
    apple: '/assets/images/apple-logo.webp',
    appleDark: '/assets/images/apple-logo-dark.webp',
    nike: '/assets/images/nike-logo.webp',
    nikeDark: '/assets/images/nike-logo-dark.webp',
  },
} as const;

import tokens from '@/styles/tokens/colors';

export const COLORS = {
  gold: tokens.gold || '#FCD34D',
  orange: tokens.racOrange || '#F97316',
  slate: {
    950: tokens.racSlate900 || '#030712',
    900: tokens.racSlate900 || '#0f172a',
    800: tokens.racSlate800 || '#1e293b',
    700: tokens.racSlate700 || '#334155',
  },
} as const;

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
} as const;
