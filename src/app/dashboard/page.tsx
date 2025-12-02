// src/app/dashboard/page.tsx — FINAL PROFESSIONAL VERSION (Supabase, Next.js)
'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import ConnectStrava from '@/components/ConnectStrava';

// --- Helper Functions ---
function getWeek(date: Date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1)/7);
}

// --- Logo SVG ---
const Logo = ({ className = "w-full h-full" }) => (
  <svg viewBox="0 0 100 100" className={`${className} drop-shadow-2xl`}>
    <circle cx="50" cy="50" r="45" fill="#f59e0b" opacity="0.15"/>
    <path d="M50 15 L65 35 L50 55 L35 35 Z" fill="#f59e0b" className="animate-pulse origin-center"/>
    <circle cx="50" cy="35" r="8" fill="#f59e0b"/>
  </svg>
);

// --- Custom Styles ---
const CustomStyles = () => (
  <style>{`
    .text-gold { color: #fbbf24; }
    .bg-gold { background-color: #fbbf24; }
    .border-gold { border-color: #fbbf24; }
    @keyframes pulse-gold {
      0%, 100% { opacity: 1; text-shadow: 0 0 20px rgba(251, 191, 36, 0.5); }
      50% { opacity: .7; text-shadow: 0 0 5px rgba(251, 191, 36, 0.2); }
    }
    .animate-pulse-gold {
      animation: pulse-gold 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }
  `}</style>
);

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  // 1. Auth Initialization & Data Fetching
  useEffect(() => {
    const load = async () => {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser) return router.push('/auth');
      setUser(currentUser);

      const { data: prof } = await supabase.from('profiles').select('*').eq('id', currentUser.id).single();
      setProfile(prof);

      const { data: acts } = await supabase
        .from('activities')
        .select('*')
        .eq('user_id', currentUser.id)
        .order('start_date', { ascending: false })
        .limit(20);
      setActivities(acts || []);
      setLoading(false);
    };
    load();
  }, [router, supabase]);

  // 2. Handlers
  const handleConnectStrava = async () => {
    setConnecting(true);
    try {
      // Call your API route to link Strava
      await fetch('/api/link-strava', { method: 'POST' });
      // After linking, reload profile and activities
      const { data: prof } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      setProfile(prof);
      const { data: acts } = await supabase
        .from('activities')
        .select('*')
        .eq('user_id', user.id)
        .order('start_date', { ascending: false })
        .limit(20);
      setActivities(acts || []);
    } catch (error) {
      console.error("Error connecting Strava:", error);
    } finally {
      setConnecting(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  // --- Render States ---
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <CustomStyles />
        <div className="text-6xl font-black text-gold animate-pulse-gold tracking-tight">NeverStop</div>
      </div>
    );
  }

  if (!profile?.strava_athlete_id) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-8 text-white">
        <CustomStyles />
        <div className="max-w-lg w-full bg-slate-900/90 backdrop-blur-2xl rounded-3xl p-12 text-center space-y-10 border border-slate-800 shadow-2xl">
          {/* Logo + Title */}
          <div className="space-y-4">
            <div className="mx-auto w-24 h-24">
              <Logo />
            </div>
            <h1 className="text-6xl font-black text-gold animate-pulse-gold tracking-tight">NeverStop</h1>
          </div>
          <p className="text-xl text-slate-300 font-light">Connect your Strava to unlock adaptive training and visualize your progress.</p>
          <button
            onClick={handleConnectStrava}
            disabled={connecting}
            className="group relative w-full flex items-center justify-center gap-3 px-8 py-4 bg-[#FC4C02] hover:bg-[#E34402] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold transition-all duration-200 shadow-lg hover:shadow-[#FC4C02]/20"
          >
            {connecting ? (
              <span className="animate-pulse">Connecting to Strava...</span>
            ) : (
              <>
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7 13.828h4.169" />
                </svg>
                <span>Connect with Strava</span>
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  // Dashboard Screen
  return (
    <div
      className="min-h-screen font-sans selection:bg-gold selection:text-black backdrop-blur-md relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #0a0f19 0%, #111827 60%, #020617 100%)',
      }}
    >
      {/* SVG Tech Line Background */}
      <img
        src="/assets/tech-lines-bg.svg"
        alt="Tech lines background"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none z-0"
        style={{ opacity: 0.18 }}
      />
      {/* Main dashboard content */}
  <div className="relative z-10">
      <CustomStyles />
      {/* Header */}
      <header className="border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4 group cursor-pointer">
            <div className="w-10 h-10 transition-transform duration-500 group-hover:rotate-180">
              <Logo />
            </div>
            <h1 className="text-2xl font-black text-gold tracking-tighter">NeverStop</h1>
          </div>
          <button
            onClick={handleSignOut}
            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 hover:text-white text-slate-300 rounded-xl text-sm font-medium transition-all duration-200"
          >
            Disconnect
          </button>
        </div>
      </header>

  <div className="max-w-7xl mx-auto p-6 md:p-12 space-y-16">
        {/* Hero Stats */}
        <div className="text-center space-y-6">
          <div className="relative inline-block">
            <h2 className="text-7xl md:text-9xl font-black text-gold-500 animate-pulse-gold tracking-tighter drop-shadow-lg">
              {profile.vdot_current?.toFixed(1) || '--'}
            </h2>
          </div>
          <p className="text-2xl text-silver-500 font-medium uppercase tracking-widest">Current VDOT</p>
          <div className={`inline-block px-8 py-3 ${profile.is_premium ? 'bg-gradient-to-r from-black to-gold-500 text-gold-500' : 'bg-black text-silver-400'} rounded-full font-bold text-sm tracking-wider uppercase shadow-lg border-r-8 border-gold-500`}>
            {profile.is_premium ? 'Premium Member' : 'Free Tier'}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-black/80 backdrop-blur-md rounded-3xl p-8 border border-silver-500 text-center hover:bg-black transition duration-300 group">
            <p className="text-5xl font-black text-gold-500 group-hover:text-silver-500 transition-colors">{activities.length}</p>
            <p className="text-silver-400 mt-2 font-medium uppercase tracking-wider text-sm">Total Runs</p>
          </div>
          <div className="bg-black/80 backdrop-blur-md rounded-3xl p-8 border border-silver-500 text-center hover:bg-black transition duration-300 group">
            <p className="text-5xl font-black text-silver-500 group-hover:text-gold-500 transition-colors">
              {activities.length > 0 
                ? Math.round((new Set(activities.slice(0, 30).map(a => getWeek(new Date(a.start_date)))).size / 4) * 100)
                : 0}%
            </p>
            <p className="text-silver-400 mt-2 font-medium uppercase tracking-wider text-sm">Consistency (30d)</p>
          </div>
          <div className="bg-black/80 backdrop-blur-md rounded-3xl p-8 border border-silver-500 text-center hover:bg-black transition duration-300">
            <p className="text-5xl font-black text-gold-500">✓</p>
            <p className="text-silver-400 mt-2 font-medium uppercase tracking-wider text-sm">Strava Connected</p>
          </div>
        </div>

        {/* Recent Runs */}
        <section className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold text-gold-500 drop-shadow">Recent Activities</h2>
             <span className="text-slate-500 text-sm">Last 20 runs</span>
          </div>
         
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {activities.length === 0 && (
                <div className="col-span-full py-12 text-center text-slate-600">
                    No runs found. Go for a run!
                </div>
            )}
            {activities.map((act: any) => (
              <div
                key={act.id}
                className="group relative bg-slate-900/40 backdrop-blur-md rounded-2xl p-6 border border-slate-800/50 hover:border-gold/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-amber-900/10 cursor-default overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                </div>

                <div className="flex justify-between items-start mb-4">
                    <h3 className="font-bold text-lg truncate text-silver-500 group-hover:text-gold-500 transition-colors pr-8">{act.name}</h3>
                </div>
               
                <p className="text-silver-400 text-xs font-mono mb-6 uppercase tracking-wider">
                  {new Date(act.start_date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                </p>

                <div className="flex justify-between items-end border-t border-slate-800/50 pt-4 mt-auto">
                  <div>
                    <div className="flex items-baseline gap-1">
                        <p className="text-3xl font-black text-gold-500 group-hover:text-silver-500 transition-colors">
                        {act.vdot_generated?.toFixed(1) || '--'}
                        </p>
                        <span className="text-xs text-silver-400 font-bold">VDOT</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-mono text-silver-500 group-hover:text-gold-500 transition-colors">
                      {(act.distance / 1000).toFixed(2)} <span className="text-sm text-silver-400">km</span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="text-center py-20 opacity-50 hover:opacity-100 transition-opacity duration-700">
          <p className="text-4xl md:text-5xl font-thin text-silver-500">Every run makes you faster</p>
          <div className="text-8xl mt-8 animate-pulse-gold inline-block transform hover:rotate-12 transition-transform duration-500 cursor-pointer">✨</div>
        </div>
      </div>
      </div>
    </div>
  );
}
