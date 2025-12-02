// src/components/UserMenu.tsx
'use client';

import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function UserMenu({ user }: { user: any }) {
  const router = useRouter();
  const supabase = createClient();
  const [isOpen, setIsOpen] = useState(false);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-white transition"
      >
        Menu
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-slate-800 rounded-lg shadow-lg border border-slate-700 z-50">
          <div className="p-4 border-b border-slate-700">
            <p className="text-sm text-slate-300">{user?.email}</p>
          </div>
          <a
            href="/dashboard/profile"
            className="block px-4 py-2 text-white hover:bg-slate-700 transition"
          >
            Profile
          </a>
          <a
            href="/dashboard/settings"
            className="block px-4 py-2 text-white hover:bg-slate-700 transition"
          >
            Settings
          </a>
          <button
            onClick={handleSignOut}
            className="w-full text-left px-4 py-2 text-red-400 hover:bg-slate-700 transition"
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
