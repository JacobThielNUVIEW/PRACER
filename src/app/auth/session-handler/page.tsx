'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function SessionHandler() {
  const router = useRouter();
  const supabase = createClient();
  const [status, setStatus] = useState('Checking session...');
  const [debugInfo, setDebugInfo] = useState('');

  useEffect(() => {
    let sessionCheckTimeout: NodeJS.Timeout;
    let redirectTimeout: NodeJS.Timeout;
    let forceRedirectTimeout: NodeJS.Timeout;

    const checkSession = async () => {
      try {
        setStatus('Reading authentication...');
        console.log('🔍 Checking for session...');
        console.log('📍 Current URL:', window.location.href);
        
        // Wait a moment for Supabase to read the hash
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const { data: { session } } = await supabase.auth.getSession();
        
        console.log('📊 Session check result:', { 
          hasSession: !!session, 
          userId: session?.user?.id,
          email: session?.user?.email,
          accessToken: !!session?.access_token
        });
        
        setDebugInfo(`Session: ${!!session ? 'YES' : 'NO'} | User: ${session?.user?.email || 'none'}`);
        
        if (session) {
          console.log('✅ Session found! User:', session.user.email);
          setStatus('Session confirmed, redirecting...');
          
          // Give the dashboard time to fetch the profile
          redirectTimeout = setTimeout(() => {
            console.log('🚀 Redirecting to dashboard...');
            router.replace('/dashboard');
          }, 500);
        } else {
          console.error('❌ No session found, will force redirect to dashboard anyway');
          setStatus('Completing authentication setup...');
          
          // Force redirect anyway - server will check and handle
          redirectTimeout = setTimeout(() => {
            console.log('🚀 Force redirecting to dashboard...');
            router.replace('/dashboard');
          }, 1000);
        }
      } catch (error) {
        console.error('❌ Error checking session:', error);
        setStatus('Error checking session. Redirecting...');
        setDebugInfo(`Error: ${error instanceof Error ? error.message : 'Unknown'}`);
        
        sessionCheckTimeout = setTimeout(() => {
          router.push('/dashboard');
        }, 1000);
      }
    };

    // Start checking immediately
    checkSession();

    // Force redirect after 8 seconds no matter what
    forceRedirectTimeout = setTimeout(() => {
      console.log('⏱️ Force redirect timeout reached, redirecting to dashboard');
      router.push('/dashboard');
    }, 8000);

    // Set up auth state listener as backup
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('🔐 Auth state changed:', event, { hasSession: !!session, email: session?.user?.email });
      if (event === 'SIGNED_IN' && session) {
        setStatus('Session confirmed, redirecting...');
        redirectTimeout = setTimeout(() => {
          router.replace('/dashboard');
        }, 300);
      }
    });

    // Cleanup
    return () => {
      clearTimeout(sessionCheckTimeout);
      clearTimeout(redirectTimeout);
      clearTimeout(forceRedirectTimeout);
      subscription.unsubscribe();
    };
  }, [router, supabase]);

  // Show a loading screen while the session is being established
  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-b from-slate-950 to-slate-900">
      <div className="text-center space-y-4">
  <div className="w-12 h-12 border-4 border-gold-500/30 border-t-gold-500 rounded-full animate-spin mx-auto"></div>
  <p className="text-gold-500 animate-pulse text-lg font-semibold">{status}</p>
        <p className="text-slate-400 text-sm">This should only take a few seconds...</p>
        {debugInfo && <p className="text-slate-500 text-xs mt-4">{debugInfo}</p>}
      </div>
    </div>
  );
}
