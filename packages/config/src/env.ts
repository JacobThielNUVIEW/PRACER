// Environment variable validation
export const env = {
  // Supabase
  SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY!,

  // OAuth
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID!,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET!,
  STRAVA_CLIENT_ID: process.env.STRAVA_CLIENT_ID!,
  STRAVA_CLIENT_SECRET: process.env.STRAVA_CLIENT_SECRET!,

  // OpenAI
  OPENAI_API_KEY: process.env.OPENAI_API_KEY!,

  // Stripe
  STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY!,

  // N8N
  N8N_WEBHOOK_URL: process.env.N8N_WEBHOOK_URL!,
  N8N_API_KEY: process.env.N8N_API_KEY!,

  // Development
  ENABLE_AUTO_LOGIN: process.env.NEXT_PUBLIC_ENABLE_AUTO_LOGIN === 'true',
  DEV_USER_EMAIL: process.env.DEV_USER_EMAIL!,
  DEV_USER_PASSWORD: process.env.DEV_USER_PASSWORD!,
} as const;

// Validate required environment variables
const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
] as const;

export function validateEnv() {
  const missing = requiredEnvVars.filter(key => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}