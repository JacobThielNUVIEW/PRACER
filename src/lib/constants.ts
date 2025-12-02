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
  },
} as const;

export const COLORS = {
  gold: '#FCD34D',
  orange: '#F97316',
  slate: {
    950: '#030712',
    900: '#0f172a',
    800: '#1e293b',
    700: '#334155',
  },
} as const;

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
} as const;
