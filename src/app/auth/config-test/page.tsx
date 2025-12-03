// src/app/auth/config-test/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function ConfigTestPage() {
  const supabase = createClient();
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getConfig = async () => {
      try {
        // Get the Supabase config
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        
        console.log('📋 Supabase Config:');
        console.log('URL:', supabaseUrl);
        console.log('Anon Key:', anonKey?.substring(0, 20) + '...');
        
        // Try to get session
        const { data: { session } } = await supabase.auth.getSession();
        const { data: { user } } = await supabase.auth.getUser();
        
        setConfig({
          url: supabaseUrl,
          hasAnonKey: !!anonKey,
          session: !!session,
          user: user?.email || null,
          sessionUser: session?.user?.email || null,
        });
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    getConfig();
  }, []);

  if (loading) return <div className="p-8 text-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <h1 className="text-3xl font-bold mb-6">🔧 Supabase Configuration Check</h1>
      
      <div className="max-w-2xl space-y-4">
        <div className="bg-slate-800 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Environment Variables</h2>
          <pre className="text-sm bg-slate-900 p-4 rounded overflow-auto">
            {JSON.stringify(config, null, 2)}
          </pre>
        </div>

        <div className="bg-slate-800 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">What should be in Supabase:</h2>
          <div className="space-y-2 text-sm">
            <p>📌 <strong>Site URL:</strong> http://localhost:3000</p>
            <p>📌 <strong>Redirect URLs:</strong></p>
            <ul className="ml-4 space-y-1">
              <li>• http://localhost:3000/auth/callback</li>
              <li>• http://localhost:3000</li>
            </ul>
            <p>📌 <strong>Google Provider:</strong></p>
            <ul className="ml-4 space-y-1">
              <li>• Client ID: ✓</li>
              <li>• Client Secret: ✓</li>
            </ul>
          </div>
        </div>

        <div className="bg-slate-800 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Next Steps:</h2>
          <ol className="space-y-2 text-sm list-decimal list-inside">
            <li>Go to Supabase Dashboard</li>
            <li>Project Settings → Authentication</li>
            <li>Check URL Configuration matches above</li>
            <li>Check Providers → Google has credentials</li>
            <li>Then try signup again</li>
          </ol>
        </div>

        <div className="flex gap-4">
          <a href="/auth" className="px-4 py-2 bg-gold-500 text-slate-900 rounded font-bold">
            Back to Auth
          </a>
          <a href="/" className="px-4 py-2 bg-slate-700 text-white rounded font-bold">
            Home
          </a>
        </div>
      </div>
    </div>
  );
}
