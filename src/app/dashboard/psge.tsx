// src/app/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import ConnectStrava from '@/components/ConnectStrava';
import ActivityHeatmap from '@/components/ActivityHeatmap';

export default function Dashboard() {
  const [profile, setProfile] = useState<any>(null);
  const [scores, setScores] = useState<any[]>([]);
  const supabase = createClient();

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [profRes, scoresRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).single(),
        supabase.from('calendar_scores').select('*').eq('user_id', user.id)
      ]);

      setProfile(profRes.data);
      setScores(scoresRes.data || []);
    };
    load();
  }, []);

  if (!profile) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center space-y-8">
          <h1 className="text-4xl font-bold text-gold-500">NeverStop Dashboard</h1>
          <ConnectStrava />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="flex justify-between items-center">
          <h1 className="text-5xl font-black text-gold-500">Welcome back!</h1>
          <div className="text-2xl font-mono text-gold-500">
            VDOT {profile.vdot_current?.toFixed(1) || '—'}
          </div>
        </div>

        <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800">
          <h2 className="text-xl text-slate-400 mb-6">Consistency Heatmap (Last 30 Days)</h2>
          <ActivityHeatmap scores={scores} />
        </div>

        <div className="text-center py-12">
          <p className="text-3xl mb-8">Your training is live and learning.</p>
          <div className="text-6xl animate-pulse-gold">🟡</div>
        </div>
      </div>
    </div>
  );
}