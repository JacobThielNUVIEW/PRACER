// src/app/auth/page.tsx
'use client';

import { createClient } from '@/lib/supabase/client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function AuthPage() {
  const supabase = createClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(true);

  // Check for errors from callback
  useEffect(() => {
    const errorParam = searchParams.get('error');
    if (errorParam) {
      setError(decodeURIComponent(errorParam));
    }
  }, [searchParams]);

  const signInWithGoogle = async () => {
    setLoading(true);
    setError('');
    
    console.log('🔵 Starting Google OAuth...');
    
    try {
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${location.origin}/auth/callback`,
        },
      });
      
      if (oauthError) {
        console.error('❌ OAuth error:', oauthError);
        setError(oauthError.message || 'Failed to start Google sign in');
        setLoading(false);
      }
    } catch (err: any) {
      console.error('❌ Exception:', err);
      setError(err.message || 'An unexpected error occurred');
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
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });

        if (signUpError) {
          setError(signUpError.message);
          setLoading(false);
          return;
        }

        if (data?.session) {
          await new Promise(resolve => setTimeout(resolve, 500));
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
          await new Promise(resolve => setTimeout(resolve, 500));
          router.push('/dashboard');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-6xl font-black text-gold animate-pulse-gold">NeverStop</h1>
          <p className="mt-4 text-xl text-slate-400">Join the adaptive training revolution</p>
        </div>

        {/* Toggle between Sign Up and Sign In */}
        <div className="flex gap-2 bg-slate-800/50 p-1.5 rounded-xl border border-slate-700/50">
          <button
            onClick={() => {
              setIsSignUp(true);
              setError('');
            }}
            className={`flex-1 py-2.5 rounded-lg font-semibold transition-all duration-200 ${
              isSignUp
                ? 'bg-gradient-to-r from-gold to-orange text-slate-900 shadow-lg shadow-gold/20'
                : 'text-slate-400 hover:text-slate-300 hover:bg-slate-700/30'
            }`}
          >
            Sign Up
          </button>
          <button
            onClick={() => {
              setIsSignUp(false);
              setError('');
            }}
            className={`flex-1 py-2.5 rounded-lg font-semibold transition-all duration-200 ${
              !isSignUp
                ? 'bg-gradient-to-r from-gold to-orange text-slate-900 shadow-lg shadow-gold/20'
                : 'text-slate-400 hover:text-slate-300 hover:bg-slate-700/30'
            }`}
          >
            Sign In
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 backdrop-blur-sm text-red-300 px-4 py-3 rounded-xl text-sm flex items-start gap-3">
            <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">{error}</span>
          </div>
        )}

        <div className="space-y-4">
          {/* Google Button - Google Style */}
          <button
            onClick={signInWithGoogle}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white text-slate-900 rounded-xl font-medium text-lg hover:shadow-2xl transition-shadow border border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 6.5c1.62 0 3.08.56 4.23 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.41 6.16-4.41z"/>
            </svg>
            Continue with Google
          </button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-700/50"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-slate-950 text-slate-500 font-medium uppercase tracking-wider">or continue with email</span>
            </div>
          </div>

          {/* Email Form */}
          <form onSubmit={handleEmailAuth} className="space-y-4">
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-6 py-4 bg-slate-800 text-white rounded-xl font-medium text-lg border border-slate-700 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition placeholder-slate-500"
            />
            <input
              type="password"
              placeholder={isSignUp ? "Create password (min 6 characters)" : "Enter your password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-6 py-4 bg-slate-800 text-white rounded-xl font-medium text-lg border border-slate-700 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition placeholder-slate-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-4 bg-gradient-to-r from-gold to-orange text-slate-900 rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-gold/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (isSignUp ? 'Creating account...' : 'Signing in...') : (isSignUp ? 'Create Account' : 'Sign In')}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-slate-500">
          By continuing, you agree to our <a href="#" className="text-gold hover:underline">Terms</a> and <a href="#" className="text-gold hover:underline">Privacy Policy</a>
        </p>
      </div>
    </div>
  );
}
