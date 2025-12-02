// src/app/auth/debug/page.tsx
'use client';

import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';

export default function DebugPage() {
  const supabase = createClient();
  const [session, setSession] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const { data: { user } } = await supabase.auth.getUser();
      setSession(session);
      setUser(user);
      setLoading(false);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth event:', event);
        setSession(session);
      }
    );

    return () => subscription?.unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Auth Debug Info</h1>

      <div className="space-y-6 max-w-2xl">
        <div className="bg-slate-800 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Session Status</h2>
          {loading ? (
            <p className="text-slate-400">Loading...</p>
          ) : session ? (
            <div className="space-y-2 text-sm font-mono">
              <p className="text-green-400">✓ Session Active</p>
              <p className="text-slate-300">Access Token: {session.access_token?.substring(0, 20)}...</p>
              <p className="text-slate-300">User ID: {session.user?.id}</p>
              <p className="text-slate-300">Email: {session.user?.email}</p>
            </div>
          ) : (
            <p className="text-red-400">✗ No Active Session</p>
          )}
        </div>

        <div className="bg-slate-800 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">User Info</h2>
          {user ? (
            <div className="space-y-2 text-sm font-mono">
              <p className="text-green-400">✓ User Logged In</p>
              <p className="text-slate-300">ID: {user.id}</p>
              <p className="text-slate-300">Email: {user.email}</p>
              <p className="text-slate-300">Provider: {user.app_metadata?.provider || 'unknown'}</p>
            </div>
          ) : (
            <p className="text-red-400">✗ Not Logged In</p>
          )}
        </div>

        <div className="bg-slate-800 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Environment</h2>
          <div className="space-y-2 text-sm font-mono">
            <p className="text-slate-300">Supabase URL: {process.env.NEXT_PUBLIC_SUPABASE_URL}</p>
            <p className="text-slate-300">Callback: {window.location.origin}/auth/callback</p>
          </div>
        </div>

        <div className="flex gap-4">
          <a
            href="/"
            className="px-4 py-2 bg-gold text-slate-900 rounded font-bold hover:opacity-90"
          >
            Home
          </a>
          <a
            href="/auth"
            className="px-4 py-2 bg-slate-700 text-white rounded font-bold hover:bg-slate-600"
          >
            Back to Auth
          </a>
        </div>
      </div>
    </div>
  );
}
