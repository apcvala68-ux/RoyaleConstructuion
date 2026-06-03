'use client';

import * as React from 'react';
import { useAppStore } from '@/stores/app';

export function StoreInitializer() {
  const init = useAppStore((s) => s.init);
  const initialized = useAppStore((s) => s.initialized);

  React.useEffect(() => {
    init();
  }, [init]);

  if (initialized) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        <p className="text-sm text-muted-foreground">Loading your data...</p>
      </div>
    </div>
  );
}
