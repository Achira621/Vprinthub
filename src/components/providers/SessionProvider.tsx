'use client';

import { useEffect } from 'react';
import { createSession } from '@/lib/session';

export default function SessionProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // On component mount, ensure a session exists. 
    // This runs only on the client-side.
    createSession();
  }, []);

  return <>{children}</>;
}
