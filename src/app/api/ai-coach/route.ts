import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateCoachNotes } from '@/lib/ai-provider';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { activityId } = await request.json();

    if (!activityId) {
      return NextResponse.json({ error: 'Activity ID required' }, { status: 400 });
    }

    // Get activity data
    const { data: activity, error: activityError } = await supabase
      .from('activities')
      .select('*')
      .eq('id', activityId)
      .eq('user_id', user.id)
      .single();

    if (activityError || !activity) {
      return NextResponse.json({ error: 'Activity not found' }, { status: 404 });
    }

    // Check if user has AI coaching enabled
    const { data: profile } = await supabase
      .from('profiles')
      .select('ai_coaching_enabled')
      .eq('id', user.id)
      .single();

    if (!profile?.ai_coaching_enabled) {
      return NextResponse.json({ error: 'AI coaching not enabled' }, { status: 403 });
    }

    // Generate coaching notes using local Ollama
    const notes = await generateCoachNotes(activity);

    // Update activity with AI notes
    const { error: updateError } = await supabase
      .from('activities')
      .update({
        ai_coach_notes: notes,
        ai_coach_processed_at: new Date().toISOString()
      })
      .eq('id', activityId);

    if (updateError) {
      console.error('Error updating activity:', updateError);
      return NextResponse.json({ error: 'Failed to update activity' }, { status: 500 });
    }

    return NextResponse.json({ success: true, notes });

  } catch (error) {
    console.error('AI coach error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}