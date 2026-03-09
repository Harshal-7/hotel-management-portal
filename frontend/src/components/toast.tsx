import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';

type ToastVariant = 'success' | 'error' | 'info';

type Toast = {
  id: string;
  variant: ToastVariant;
  title?: string;
  message: string;
};

type PushArgs = {
  variant: ToastVariant;
  title?: string;
  message: string;
  durationMs?: number;
};

type ToastContextValue = {
  push: (args: PushArgs) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

function variantStyles(variant: ToastVariant): { badge: string; border: string; title: string } {
  switch (variant) {
    case 'success':
      return { badge: 'bg-violet-50 text-violet-700 border-violet-200', border: 'border-violet-200', title: 'text-violet-900' };
    case 'error':
      return { badge: 'bg-red-50 text-red-700 border-red-200', border: 'border-red-200', title: 'text-red-900' };
    case 'info':
    default:
      return { badge: 'bg-sky-50 text-sky-700 border-sky-200', border: 'border-sky-200', title: 'text-slate-900' };
  }
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timeouts = useRef(new Map<string, number>());

  const dismiss = useCallback((id: string) => {
    const t = timeouts.current.get(id);
    if (t) {
      window.clearTimeout(t);
      timeouts.current.delete(id);
    }
    setToasts((prev) => prev.filter((x) => x.id !== id));
  }, []);

  const push = useCallback(
    ({ durationMs = 3200, ...args }: PushArgs) => {
      const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
      const toast: Toast = { id, ...args };
      setToasts((prev) => [toast, ...prev].slice(0, 4));

      const timeoutId = window.setTimeout(() => dismiss(id), durationMs);
      timeouts.current.set(id, timeoutId);
    },
    [dismiss]
  );

  const value = useMemo<ToastContextValue>(() => ({ push }), [push]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed inset-0 z-50 flex flex-col items-end justify-end gap-2 p-4">
        {toasts.map((t) => {
          const styles = variantStyles(t.variant);
          return (
            <div
              key={t.id}
              className={`pointer-events-auto w-full max-w-72 rounded-2xl border ${styles.border} bg-white shadow-lg`}
              role="status"
              aria-live="polite"
            >
              <div className="flex items-center gap-3 p-3">
                <span className={`mt-0.5 inline-flex rounded-full border px-2 py-0.5 text-xs font-semibold ${styles.badge}`}>
                  {t.variant.toUpperCase()}
                </span>
                <div className="min-w-0 flex-1">
                  {t.title ? <div className={`text-sm font-semibold ${styles.title}`}>{t.title}</div> : null}
                  <div className="mt-0.5 text-sm text-slate-600 wrap-break-word">{t.message}</div>
                </div>
                <button
                  type="button"
                  onClick={() => dismiss(t.id)}
                  className="rounded-md px-1 text-sm font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
                  aria-label="Dismiss"
                >
                  ×
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');

  return useMemo(
    () => ({
      success: (message: string, title?: string) => ctx.push({ variant: 'success', message, title }),
      error: (message: string, title?: string) => ctx.push({ variant: 'error', message, title }),
      info: (message: string, title?: string) => ctx.push({ variant: 'info', message, title }),
    }),
    [ctx]
  );
}

