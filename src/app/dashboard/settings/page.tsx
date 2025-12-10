// src/app/dashboard/settings/page.tsx
import { createClient } from '@/lib/supabase/server';
import AiToggle from '@/components/AiToggle';
import { redirect } from 'next/navigation';

export const revalidate = 0;

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) redirect('/auth');

  const { data: profile } = await supabase
    .from('profiles')
    .select('ai_coaching_enabled')
    .eq('id', user.id)
    .single();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-gold mb-8">Settings</h1>
        
        <div className="space-y-6">
          <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-8">
            <h2 className="text-2xl font-semibold text-white mb-6">AI Coach Enhancement</h2>
            <AiToggle 
              initialValue={profile?.ai_coaching_enabled || false} 
              userId={user.id} 
            />
            
            <div className="mt-6 text-xs text-slate-500 space-y-2 border-t border-slate-800 pt-4">
              <p>✓ When ON: Only your VDOT score (calculated by PRACER) is sent to AI for motivation</p>
              <p>✗ Never sent: GPS tracks, run names, heart rate, locations, or raw Strava data</p>
              <p>✓ 100% compliant with Strava 2025 API terms</p>
            </div>
          </div>

          <div className="text-center text-slate-600 text-sm">
            <p>PRACER • NEVER STOP</p>
          </div>
        </div>
      </div>
    </div>
  );
}
