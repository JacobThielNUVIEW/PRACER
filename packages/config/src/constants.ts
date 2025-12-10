// Application constants
export const APP_NAME = 'PRACER';
export const APP_VERSION = '0.1.0';

// API endpoints
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

// Feature flags
export const FEATURES = {
  AUTO_LOGIN: process.env.NEXT_PUBLIC_ENABLE_AUTO_LOGIN === 'true',
  ANALYTICS: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
} as const;