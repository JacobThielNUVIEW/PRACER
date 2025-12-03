// src/app/test-auth/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function TestAuthPage() {
  const supabase = createClient();
  const [session, setSession] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [hash, setHash] = useState('');

  useEffect(() => {
    // Get hash from URL
    if (typeof window !== 'undefined') {
      setHash(window.location.hash);
      
      console.log('📍 Current URL:', window.location.href);
      console.log('📍 Hash:', window.location.hash);
    }

    const checkAuth = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        console.log('Session:', session);
        console.log('Session Error:', sessionError);
        console.log('User:', user);
        console.log('User Error:', userError);
        
        setSession(session);
        setUser(user);
      } catch (err) {
        console.error('Auth check error:', err);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white p-8">
        <p>Loading auth state...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <h1 className="text-4xl font-bold mb-8">🔍 Auth Debug</h1>

      <div className="space-y-6 max-w-2xl">
        {hash && (
            <div className="bg-slate-800 p-6 rounded-lg border border-gold-500">
              <h2 className="text-xl font-bold text-gold-500 mb-2">✓ URL Hash Detected</h2>
            <p className="text-xs text-slate-300 break-all">{hash.substring(0, 100)}...</p>
            {hash.includes('access_token') && (
              <p className="text-sm text-green-400 mt-2">✓ Contains access_token</p>
            )}
          </div>
        )}

        <div className="bg-slate-800 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Session Status</h2>
          {session ? (
            <div className="space-y-2 text-sm font-mono">
              <p className="text-green-400">✓ Session Active</p>
              <p className="text-slate-300">User ID: {session.user?.id}</p>
              <p className="text-slate-300">Email: {session.user?.email}</p>
              <p className="text-slate-300">Access Token: {session.access_token?.substring(0, 20)}...</p>
            </div>
          ) : (
            <p className="text-red-400">✗ No Session</p>
          )}
        </div>

        <div className="bg-slate-800 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">User Status</h2>
          {user ? (
            <div className="space-y-2 text-sm font-mono">
              <p className="text-green-400">✓ User Logged In</p>
              <p className="text-slate-300">ID: {user.id}</p>
              <p className="text-slate-300">Email: {user.email}</p>
            </div>
          ) : (
            <p className="text-red-400">✗ Not Logged In</p>
          )}
        </div>

        <div className="flex gap-4">
          <a href="/" className="px-4 py-2 bg-gold-500 text-slate-900 rounded font-bold">
            Home
          </a>
          <a href="/auth" className="px-4 py-2 bg-slate-700 text-white rounded font-bold">
            Auth
          </a>
          <a href="/dashboard" className="px-4 py-2 bg-slate-700 text-white rounded font-bold">
            Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}
