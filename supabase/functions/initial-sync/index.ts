// supabase/functions/initial-sync/index.ts
import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';

// Only allow sync for your user
const MY_USER_ID = '0a8965de-c90c-40bf-b6c2-e45961877945'; // Replace with your actual user_id

// Helper: Fetch Strava activities
async function fetchStravaActivities(accessToken: string) {
  const response = await fetch('https://www.strava.com/api/v3/athlete/activities?per_page=50', {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  if (!response.ok) throw new Error('Failed to fetch Strava activities');
  return await response.json();
}

// Helper: Upsert activities into Supabase
async function upsertActivities(supabaseUrl: string, serviceRoleKey: string, userId: string, activities: any[]) {
  const upsertRes = await fetch(`${supabaseUrl}/rest/v1/activities`, {
    method: 'POST',
    headers: {
      'apikey': serviceRoleKey,
      'Authorization': `Bearer ${serviceRoleKey}`,
      'Content-Type': 'application/json',
      'Prefer': 'resolution=merge-duplicates'
    },
    body: JSON.stringify(
      activities.map((act: any) => ({
        strava_activity_id: act.id,
        user_id: userId,
        name: act.name,
        type: act.type,
        start_date: act.start_date,
        distance: act.distance,
        // Add other fields as needed
      }))
    )
  });
  if (!upsertRes.ok) throw new Error('Failed to upsert activities');
  return await upsertRes.json();
}

serve(async (req) => {
  try {
    const { user_id } = await req.json();
    if (user_id !== MY_USER_ID) {
      return new Response(JSON.stringify({ error: 'Sync restricted to owner account.' }), { status: 403 });
    }
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || Deno.env.get('NEXT_PUBLIC_SUPABASE_URL');
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    // 1. Get user profile (with Strava tokens)
    const profileRes = await fetch(`${supabaseUrl}/rest/v1/profiles?select=access_token&user_id=eq.${user_id}`, {
      headers: {
        'apikey': serviceRoleKey,
        'Authorization': `Bearer ${serviceRoleKey}`,
      }
    });
    const profiles = await profileRes.json();
    if (!profiles.length || !profiles[0].access_token) {
      return new Response(JSON.stringify({ error: 'No Strava token found' }), { status: 400 });
    }
    const accessToken = profiles[0].access_token;

    // 2. Fetch activities from Strava
    const activities = await fetchStravaActivities(accessToken);

    // 3. Upsert activities into Supabase
    await upsertActivities(supabaseUrl, serviceRoleKey, user_id, activities);

    return new Response(JSON.stringify({ success: true, count: activities.length }), { headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
});