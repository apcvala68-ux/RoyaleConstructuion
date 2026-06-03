'use client';

import * as React from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

interface ToastData {
  id: string;
  message: string;
  type: 'success' | 'error';
}

let addToastFn: ((t: ToastData) => void) | null = null;

export function toast(message: string, type: 'success' | 'error' = 'success') {
  addToastFn?.({ id: Math.random().toString(36).slice(2), message, type });
}

export function ToastContainer() {
  const [toasts, setToasts] = React.useState<ToastData[]>([]);

  React.useEffect(() => {
    addToastFn = (t) => {
      setToasts((prev) => [...prev, t]);
      setTimeout(() => setToasts((prev) => prev.filter((x) => x.id !== t.id)), 3000);
    };
    return () => { addToastFn = null; };
  }, []);

  const remove = (id: string) => setToasts((prev) => prev.filter((x) => x.id !== id));

  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg backdrop-blur-md animate-in slide-in-from-right-2 fade-in duration-200 ${
            t.type === 'success'
              ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
              : 'bg-red-500/15 border-red-500/30 text-red-400'
          }`}
        >
          {t.type === 'success' ? <CheckCircle className="h-4 w-4 shrink-0" /> : <XCircle className="h-4 w-4 shrink-0" />}
          <span className="text-sm font-medium">{t.message}</span>
          <button onClick={() => remove(t.id)} className="ml-2 p-0.5 rounded hover:bg-white/10 cursor-pointer">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
