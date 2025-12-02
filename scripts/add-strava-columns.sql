-- Add Strava OAuth columns to profiles table
-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard/project/ensctsrpdbehptyllbem/editor

ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS strava_athlete_id TEXT,
ADD COLUMN IF NOT EXISTS access_token TEXT,
ADD COLUMN IF NOT EXISTS refresh_token TEXT,
ADD COLUMN IF NOT EXISTS token_expires_at TIMESTAMPTZ;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_strava_athlete_id ON profiles(strava_athlete_id);
