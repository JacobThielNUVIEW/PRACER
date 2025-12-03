'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function AuthHandler() {
  const router = useRouter();
  const [codeParam, setCodeParam] = useState<string | null>(null);
  const supabase = createClient();
  const [status, setStatus] = useState('Finalizing login...');
  const [error, setError] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      setCodeParam(code);
      console.log('🔍 Handler page loaded');
      console.log('Code from URL:', code);
    }
  }, []);

  useEffect(() => {
    if (!codeParam) {
      console.log('❌ No code - this handler only supports PKCE flow');
      setTimeout(() => router.push('/auth'), 2000);
      return;
    }

    const handleAuth = async () => {
      try {
    console.log('🔐 Starting PKCE code exchange on client...');
        setStatus('Exchanging authorization code...');

        // Exchange the code for a session
  const { error: exchangeError, data } = await supabase.auth.exchangeCodeForSession(codeParam ?? '');

        console.log('Exchange response:', { 
          hasError: !!exchangeError, 
          errorMsg: exchangeError?.message,
          hasSession: !!data?.session,
          userId: data?.user?.id,
          userEmail: data?.user?.email
        });

        if (exchangeError) {
          console.error('❌ Exchange error:', exchangeError);
          setError(`Authentication failed: ${exchangeError.message}`);
          setTimeout(() => router.push('/auth'), 3000);
          return;
        }

        if (!data?.session) {
          console.error('❌ No session in response');
          setError('Session not established');
          setTimeout(() => router.push('/auth'), 3000);
          return;
        }

        console.log('✅ Session established');
        console.log('User:', data.user?.email);

        // Wait a moment for session to be fully established
        await new Promise(resolve => setTimeout(resolve, 800));

        // Verify session is actually set
        const { data: { session } } = await supabase.auth.getSession();
        console.log('📊 Verifying session:', { hasSession: !!session, email: session?.user?.email });

        if (!session) {
          console.error('❌ Session verification failed');
          setError('Session could not be verified');
          setTimeout(() => router.push('/auth'), 3000);
          return;
        }

        setStatus('Redirecting to dashboard...');
        console.log('🚀 Redirecting to dashboard');
        
        router.replace('/dashboard');
        
      } catch (err: any) {
        console.error('❌ Error:', err);
        setError(`Error: ${err.message}`);
        setTimeout(() => router.push('/auth'), 3000);
      }
    };

    handleAuth();
  }, [codeParam, router, supabase]);

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-b from-slate-950 to-slate-900">
      <div className="text-center space-y-4 max-w-md">
        <div className="w-12 h-12 border-4 border-gold/30 border-t-gold rounded-full animate-spin mx-auto"></div>
        <p className="text-gold text-lg font-semibold">{status}</p>
        {error && (
          <div className="bg-red-900/30 border border-red-500/50 text-red-200 p-4 rounded">
            <p className="text-sm font-semibold mb-1">Authentication Error</p>
            <p className="text-xs">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}
