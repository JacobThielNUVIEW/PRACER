import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

// Database-backed rate limiting: allow 1 sync per minute per user
export async function POST(request: Request) {
  try {
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll() },
          setAll(cookiesToSet) { try { cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options)) } catch {} }
        },
      }
    );

    // 1. Verify User
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // 2. Rate limiting: check last sync time
    const { data: syncRow } = await supabase
      .from('sync_requests')
      .select('last_sync')
      .eq('user_id', user.id)
      .single();
    const now = Date.now();
    if (syncRow && syncRow.last_sync && now - new Date(syncRow.last_sync).getTime() < 60_000) {
      return NextResponse.json({ error: 'Rate limit exceeded', code: 429 }, { status: 429 });
    }

    // 3. Update last sync time
    await supabase
      .from('sync_requests')
      .upsert({ user_id: user.id, last_sync: new Date().toISOString() }, { onConflict: 'user_id' });

    // 4. Call the Edge Function
    const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/initial-sync`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`
      },
      body: JSON.stringify({ user_id: user.id })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Edge Function Error:', errorText);
      return NextResponse.json({ error: errorText }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error: any) {
    console.error('Sync Route Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
