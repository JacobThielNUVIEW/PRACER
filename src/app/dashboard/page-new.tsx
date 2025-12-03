// src/app/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Dashboard() {
  const [profile, setProfile] = useState<any>(null);
  const [activities, setActivities] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      
      if (!currentUser) {
        router.push('/auth');
        return;
      }

      setUser(currentUser);

      const [profRes, actsRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', currentUser.id).single(),
        supabase.from('activities').select('*').eq('user_id', currentUser.id).order('start_date', { ascending: false }).limit(10),
      ]);

      setProfile(profRes.data);
      setActivities(actsRes.data || []);
      setLoading(false);
    };
    load();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
  <div className="text-6xl font-black text-gold-500 animate-pulse-gold">REACELAY</div>
      </div>
    );
  }

  if (!profile?.strava_athlete_id) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-8">
        <div className="max-w-md w-full bg-slate-900/80 backdrop-blur-xl rounded-3xl p-12 text-center space-y-8 border border-slate-800">
            <h1 className="text-5xl font-black text-gold-500 animate-pulse-gold">REACELAY</h1>
          <p className="text-xl text-slate-300">Connect your data to unlock adaptive training</p>
          <Link
            href="/auth"
            className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-gold-500 to-orange text-slate-900 px-12 py-6 rounded-2xl font-bold text-xl hover:shadow-2xl hover:shadow-[var(--gold)/0.2] hover:scale-105 transition-all duration-300 shadow-lg"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7.008 13.828h4.172" />
            </svg>
            Connect Strava
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-7xl mx-auto p-6 md:p-12 space-y-16">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div>
                <h1 className="text-6xl md:text-8xl font-black text-gold-500">Dashboard</h1>
            <p className="text-xl text-slate-400 mt-2">Your training is learning</p>
          </div>
          <div className="flex items-center gap-8">
            <div className="text-right">
              <p className="text-slate-500 text-sm uppercase tracking-wider">Current VDOT</p>
                  <p className="text-7xl md:text-9xl font-black text-gold-500 animate-pulse-gold">
                {profile.vdot_current?.toFixed(1) || '--'}
              </p>
              <div className="mt-4">
                {profile.is_premium ? (
                      <span className="inline-block px-6 py-3 bg-gold-500 text-slate-950 rounded-full font-bold">Premium Member</span>
                ) : (
                  <span className="inline-block px-6 py-3 bg-slate-800 text-slate-400 rounded-full font-bold">Free Tier</span>
                )}
              </div>
            </div>
            <div className="relative">
              <button
                onClick={handleSignOut}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-white transition"
              >
                Sign Out
              </button>
            </div>
          </div>
        </header>

        {/* Stats Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900/70 backdrop-blur-xl rounded-3xl p-8 border border-slate-800">
            <h3 className="text-slate-400 text-sm mb-2 uppercase tracking-wider">Total Activities</h3>
                <p className="text-4xl font-black text-gold-500">{activities?.length || 0}</p>
          </div>
          <div className="bg-slate-900/70 backdrop-blur-xl rounded-3xl p-8 border border-slate-800">
            <h3 className="text-slate-400 text-sm mb-2 uppercase tracking-wider">Weekly Consistency</h3>
                <p className="text-4xl font-black text-gold-500">--</p>
          </div>
          <div className="bg-slate-900/70 backdrop-blur-xl rounded-3xl p-8 border border-slate-800">
            <h3 className="text-slate-400 text-sm mb-2 uppercase tracking-wider">Strava Sync</h3>
                <p className="text-4xl font-black text-gold-500">{profile?.strava_athlete_id ? '✓' : '✗'}</p>
          </div>
        </section>

        {/* Recent Activities Grid */}
        <section className="space-y-8">
          <h2 className="text-3xl font-bold text-slate-300">Recent Runs</h2>
          {activities && activities.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {activities.map((act: any) => (
                <div key={act.id} className="bg-slate-900/70 backdrop-blur rounded-2xl p-8 border border-slate-800 hover:border-gold-500 transition-all duration-300">
                  <h3 className="font-bold text-xl text-white truncate">{act.name}</h3>
                  <p className="text-slate-400 text-sm mt-2">
                    {new Date(act.start_date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                  </p>
                  <div className="mt-6 flex justify-between items-end">
                    <div>
                          <p className="text-4xl font-black text-gold-500">{act.vdot_generated?.toFixed(1) || '--'}</p>
                      <p className="text-slate-500 text-sm">VDOT</p>
                    </div>
                    <div className="text-right">
                          <p className="text-2xl font-mono text-slate-300">{(act.distance / 1000).toFixed(2)} km</p>
                      <p className="text-slate-500 text-xs">Distance</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl p-12 border border-slate-800 text-center">
              <p className="text-slate-400 text-lg">No activities yet. Your Strava runs will appear here automatically.</p>
            </div>
          )}
        </section>

        <div className="text-center py-24">
          <p className="text-5xl font-light text-slate-400">Every run makes you faster</p>
          <div className="text-9xl mt-12 animate-pulse-gold">✨</div>
        </div>
      </div>
    </div>
  );
}
