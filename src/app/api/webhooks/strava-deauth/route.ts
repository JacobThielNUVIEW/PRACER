// src/app/api/webhooks/strava-deauth/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { authorized } = await request.json()

  if (!authorized) {
    // Deauthorize user - delete their data per GDPR
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
      // Delete activities
      await supabase
        .from('activities')
        .delete()
        .eq('strava_athlete_id', user.id) // Assuming we store athlete_id in user metadata
      
      // Delete profile
      await supabase
        .from('profiles')
        .delete()
        .eq('id', user.id)
      
      // Delete user account
      await supabase.auth.admin.deleteUser(user.id)
    }
  }

  return NextResponse.json({ success: true })
}
