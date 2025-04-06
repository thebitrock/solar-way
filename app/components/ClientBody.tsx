'use client';

import { Providers } from './Providers';

export function ClientBody({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      {children}
    </Providers>
  );
} 