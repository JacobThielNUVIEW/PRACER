// Top-level: Strava activity sync function for clean structure and lint compliance
async function syncStravaActivities(supabase: any, userId: string, accessToken: string, maxRetries = 3) {
  console.log('[INFO] Starting Strava sync for user:', userId);
  for (let retry = 0; retry < maxRetries; retry++) {
    try {
      if (retry > 0) await new Promise(resolve => setTimeout(resolve, 2 ** retry * 1000));
      // Fetch recent activities (first page only for demo; add pagination as needed)
      const response = await fetch(`https://www.strava.com/api/v3/athlete/activities?per_page=50`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      const activities = await response.json();
  console.log('[INFO] Strava activities response count:', Array.isArray(activities) ? activities.length : 'not-an-array');
      if (!Array.isArray(activities)) throw new Error('Strava activities fetch failed');
      const recentActivities = activities
        .map(act => ({
          strava_activity_id: act.id,
          user_id: userId,
          name: act.name,
          type: act.type,
          start_date: act.start_date,
          distance: act.distance,
          // Add other fields as needed
        }));
  console.log('[INFO] Prepared activities for upsert (count):', recentActivities.length);
      const { error } = await supabase
        .from('activities')
        .upsert(recentActivities, { onConflict: 'strava_activity_id' });
      if (error) {
        console.error('[DEBUG] Upsert error:', error);
      } else {
  console.log('[INFO] Upsert success for user:', userId);
        return;
      }
    } catch (err) {
      console.warn(`Sync retry ${retry + 1}:`, err);
    }
  }
  console.error('Sync failed after retries');
}
// src/app/api/link-strava/route.ts
import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  // 1. Ensure user is logged into NeverStop (via Google)
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    // If the user isn't logged into NeverStop yet, force them to log in first.
    return new Response('Not authenticated in NeverStop. Please sign in first.', { status: 401 });
  }

  if (!code) {
    return new Response('Missing authorization code from Strava.', { status: 400 });
  }

  try {
    // 2. Exchange code for tokens (Server-to-Server communication)
    const tokenResponse = await fetch('https://www.strava.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: process.env.STRAVA_CLIENT_ID,
        client_secret: process.env.STRAVA_CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
      }),
    });

    const tokens = await tokenResponse.json();

    if (tokens.errors) {
      console.error('Strava Token Error:', tokens);
      return new Response('Strava API Error.', { status: 500 });
    }

    if (!tokens.access_token) {
      console.error('No access token in response:', tokens);
      return new Response('Failed to get access token from Strava', { status: 400 });
    }

  // Removed detailed debug logging to avoid leaking secrets into logs
  // 3. Save Strava tokens to the profiles table
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        strava_athlete_id: tokens.athlete.id.toString(),
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        token_expires_at: new Date(tokens.expires_at * 1000).toISOString(),
      })
      .eq('id', user.id);

    if (profileError) {
      console.error('Profile save error:', profileError);
      return new Response(`Failed to save Strava data: ${profileError.message}`, { status: 500 });
    }

  // 4. Sync Strava activities with retry and idempotent upsert
  await syncStravaActivities(supabase, user.id, tokens.access_token);
  console.log('[INFO] Finished Strava sync for user:', user.id);

    console.log('✅ Strava linked and activities synced for user:', user.id);

    // 5. Redirect to the dashboard
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard`);
  } catch (error) {
    console.error('❌ Error linking Strava:', error);
    return new Response(`Error: ${error instanceof Error ? error.message : 'Unknown'}`, { status: 500 });
  }
}
