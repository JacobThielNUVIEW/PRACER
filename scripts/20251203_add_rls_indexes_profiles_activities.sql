-- Migration: add extensions, trigger, indexes, RLS policies, and constraints
-- Run this in your Supabase SQL Editor or with the supabase CLI using a service-role key.

-- 1. Enable required extensions
create extension if not exists "moddatetime" schema extensions;
create extension if not exists "uuid-ossp" schema extensions;

-- 2. Auto-update updated_at on profiles
-- Ensure the helper function moddatetime exists; Supabase projects often provide it via the extensions
create trigger if not exists handle_profiles_updated_at
  before update on profiles
  for each row execute procedure moddatetime(updated_at);

-- 3. Critical performance indexes
create index if not exists idx_activities_user_date 
  on activities(user_id, start_date desc);

create index if not exists idx_activities_type 
  on activities(type);

create index if not exists idx_activities_strava_id 
  on activities(strava_activity_id);

create index if not exists idx_profiles_strava_tokens 
  on profiles(strava_access_token) where strava_access_token is not null;

-- 4. Complete RLS policies (CRUD + safety)
-- Drop existing policies to avoid duplicates
drop policy if exists "Users can update own activities" on activities;
drop policy if exists "Users can delete own activities" on activities;
drop policy if exists "Users can insert own profile" on profiles;

create policy "Users can update own activities" 
  on activities for update using (auth.uid() = user_id);

create policy "Users can delete own activities" 
  on activities for delete using (auth.uid() = user_id);

create policy "Users can insert own profile" 
  on profiles for insert with check (auth.uid() = id);

create policy "Users can update own profile" 
  on profiles for update using (auth.uid() = id);

-- 5. Ensure profiles has updated_at with default
alter table profiles 
  add column if not exists updated_at timestamptz default now();

-- 6. Final unique constraint (already exists but reinforce)
alter table activities 
  add constraint if not exists unique_activity_per_user 
  unique (user_id, strava_activity_id);
