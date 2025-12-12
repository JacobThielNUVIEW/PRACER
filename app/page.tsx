'use client';

import { useEffect } from 'react';
import { useRouter } from '../lib/router-context';

export default function Page() {
  const router = useRouter();
  
  useEffect(() => {
    router.push('/dashboard');
  }, [router]);

  return null;
}