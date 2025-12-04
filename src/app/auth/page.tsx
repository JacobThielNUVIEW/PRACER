// src/app/auth/page.tsx
'use client';

import React, { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Logo from '@/components/Logo';

export default function AuthPage() {
  const supabase = createClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(true);

  const signInWithGoogle = async () => {
    setLoading(true);
    setError('');
    try {
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${location.origin}/auth/callback` },
      });
      if (oauthError) setError(oauthError.message || 'Failed to start Google sign in');
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (isSignUp) {
        const { error: signUpError, data } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
        });
        if (signUpError) {
          setError(signUpError.message);
          setLoading(false);
          return;
        }
        if (data?.session) {
          await new Promise((r) => setTimeout(r, 500));
          router.push('/dashboard');
        } else {
          setError('Check your email to confirm your account');
          setLoading(false);
        }
      } else {
        const { error: signInError, data } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) {
          setError(signInError.message);
          setLoading(false);
          return;
        }
        if (data?.session) {
          await new Promise((r) => setTimeout(r, 500));
          router.push('/dashboard');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card" style={{ background: 'var(--rac-surface)' }}>
        <div className="auth-header">
          <Logo />
          <div>
            <h1 className="auth-title">REACELAY</h1>
            <p className="auth-sub">Join the adaptive training revolution</p>
          </div>
        </div>

  <div className="flex gap-2 bg-rac-surface/50 p-1.5 rounded-xl border border-rac-border/50 mb-4">
          <button
            onClick={() => { setIsSignUp(true); setError(''); }}
            className={`flex-1 py-2.5 rounded-lg font-semibold transition-all duration-200 ${isSignUp ? 'active-toggle' : 'inactive-toggle'}`}
          >
            Sign Up
          </button>
          <button
            onClick={() => { setIsSignUp(false); setError(''); }}
            className={`flex-1 py-2.5 rounded-lg font-semibold transition-all duration-200 ${!isSignUp ? 'active-toggle' : 'inactive-toggle'}`}
          >
            Sign In
          </button>
        </div>

        {error && (
          <div role="alert" aria-live="assertive" className="bg-red-500/10 border border-red-500/30 backdrop-blur-sm text-red-300 px-4 py-3 rounded-xl text-sm flex items-start gap-3 mb-4">
            <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">{error}</span>
          </div>
        )}

        <div className="space-y-4">
          <button
            onClick={signInWithGoogle}
            disabled={loading}
            className="w-full flex items-center justify-center gap-4 px-6 py-3 bg-[var(--google-btn-bg)] text-[var(--google-btn-text)] rounded-xl font-medium text-lg hover:shadow-2xl transition-shadow border border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Continue with Google"
          >
            <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 48 48" width="20" height="20" aria-hidden>
              <path fill="var(--google-blue)" d="M43.6 20.5H42V20H24v8h11.3C33.7 32 29 35 24 35c-7 0-12.7-5.7-12.7-12.7S17 9.6 24 9.6c3.3 0 6 1.1 8.2 2.9l5.7-5.7C35.6 4.1 30.1 2 24 2 12.9 2 4.2 10.7 4.2 21.8S12.9 41.6 24 41.6c11 0 20-8 20-21.1 0-1.4-.1-2.7-.4-3.9z"/>
            </svg>
            <span style={{ color: 'var(--google-btn-text)' }}>Continue with Google</span>
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-700/50"></div>
            </div>
            <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-rac-depth text-rac-text-muted font-medium uppercase tracking-wider">or continue with email</span>
            </div>
          </div>

          <form onSubmit={handleEmailAuth} className="space-y-4">
            <label className="sr-only" htmlFor="email">Email address</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input"
            />
            <label className="sr-only" htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete={isSignUp ? 'new-password' : 'current-password'}
              placeholder={isSignUp ? "Create password (min 6 characters)" : "Enter your password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="input"
            />
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? (isSignUp ? 'Creating account...' : 'Signing in...') : (isSignUp ? 'Create Account' : 'Sign In')}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-rac-text-muted mt-4">
          By continuing, you agree to our <a href="#" className="text-rac-signal hover:underline">Terms</a> and <a href="#" className="text-rac-signal hover:underline">Privacy Policy</a>
        </p>
      </div>
    </div>
  );
}

/* CSS moved to globals.css */
