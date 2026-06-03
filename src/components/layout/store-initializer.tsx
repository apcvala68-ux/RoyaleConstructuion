'use client';

import * as React from 'react';
import { useAppStore } from '@/stores/app';

import { AlertCircle, RefreshCw } from 'lucide-react';

export function StoreInitializer() {
  const init = useAppStore((s) => s.init);
  const initialized = useAppStore((s) => s.initialized);
  const loading = useAppStore((s) => s.loading);
  const error = useAppStore((s) => s.error);

  React.useEffect(() => {
    init();
  }, [init]);

  if (initialized) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-background">
      {error ? (
        <div className="flex flex-col items-center gap-4 max-w-sm text-center px-6">
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-destructive/10">
            <AlertCircle className="h-7 w-7 text-destructive" />
          </div>
          <div>
            <p className="text-base font-semibold text-foreground">Failed to load data</p>
            <p className="text-sm text-muted-foreground mt-1">{error}</p>
          </div>
          <button
            onClick={() => { useAppStore.setState({ error: null, loading: true }); init(); }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors cursor-pointer"
          >
            <RefreshCw className="h-4 w-4" /> Retry
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <p className="text-sm text-muted-foreground">Loading your data...</p>
        </div>
      )}
    </div>
  );
}
