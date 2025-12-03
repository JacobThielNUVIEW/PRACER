// src/app/setup/page.tsx
'use client';

import { useState } from 'react';

export default function SetupPage() {
  // Gate the page by an environment flag so it's not visible in production
  if (process.env.NEXT_PUBLIC_ENABLE_SETUP !== 'true') {
    return (
      <div className="min-h-screen bg-[var(--rac-slate-900)] flex items-center justify-center px-4">
        <div className="max-w-md w-full space-y-8 text-center text-[var(--rac-text-muted)]">
          <h1 className="text-2xl font-bold">Setup Disabled</h1>
          <p>This page is disabled. To enable, set NEXT_PUBLIC_ENABLE_SETUP=true in your environment.</p>
        </div>
      </div>
    )
  }
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);

  const createAdminAccount = async () => {
    setLoading(true);
    setMessage('Creating admin account...');
    setSuccess(false);

    try {
    const tempPassword = Math.random().toString(36).slice(-12) + Math.random().toString(36).slice(-8);
    const response = await fetch('/admin/create-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'reacelay@admin.com',
      password: tempPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(`❌ Error: ${data.error}`);
        setSuccess(false);
      } else {
  setMessage(`✅ Admin account created!\nEmail: reacelay@admin.com\nPassword (temporary): ${tempPassword}\n\nYou can now login at /auth`);
        setSuccess(true);
      }
    } catch (err: any) {
      setMessage(`❌ Exception: ${err.message}`);
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-black bg-gradient-to-r from-rac-signal to-orange bg-clip-text text-transparent mb-2">
            REACELAY Setup
          </h1>
          <p className="text-slate-300">Create admin account for testing</p>
        </div>

        <div className="bg-slate-800 p-6 rounded-lg space-y-4">
      <div className="text-sm space-y-2">
            <p className="text-slate-300">This will create an admin account with:</p>
            <ul className="text-slate-400 space-y-1 ml-4">
              <li>📧 Email: <code className="bg-slate-900 px-2 py-1 rounded">reacelay@admin.com</code></li>
        <li>🔑 Password: <code className="bg-slate-900 px-2 py-1 rounded">(You will choose it on creation)</code></li>
              <li>⭐ Premium: Yes</li>
            </ul>
          </div>

    <button
            onClick={createAdminAccount}
            disabled={loading}
            className="w-full bg-gradient-to-r from-rac-signal to-orange text-[var(--rac-slate-900)] px-6 py-3 rounded-lg font-bold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating...' : 'Create Admin Account'}
          </button>

          {message && (
            <div className={`p-4 rounded-lg text-sm whitespace-pre-wrap ${success ? 'bg-green-900/30 text-green-200 border border-green-500/50' : 'bg-red-900/30 text-red-200 border border-red-500/50'}`}>
              {message}
            </div>
          )}

          {success && (
            <a
              href="/auth"
              className="block w-full text-center bg-slate-700 text-white px-6 py-2 rounded-lg font-bold hover:bg-slate-600 transition"
            >
              Go to Login →
            </a>
          )}
        </div>

        <div className="text-center">
          <a href="/" className="text-slate-400 hover:text-slate-300 transition text-sm">
            ← Back to home
          </a>
        </div>
      </div>
    </div>
  );
}
