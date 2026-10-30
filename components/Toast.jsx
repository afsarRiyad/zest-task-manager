'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import Icon from '@/components/Icon';

const ToastContext = createContext(() => {});
const SPRING = { type: 'spring', bounce: 0, duration: 0.38 };

export function useToast() {
  return useContext(ToastContext);
}

export default function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);
  const timer = useRef(null);
  const reduceMotion = useReducedMotion();

  const dismiss = useCallback(() => {
    window.clearTimeout(timer.current);
    setToast(null);
  }, []);

  const show = useCallback((message, options = {}) => {
    window.clearTimeout(timer.current);
    setToast({
      key: Date.now(),
      message,
      tone: options.tone || 'default',
      action: options.action || null,
    });
    timer.current = window.setTimeout(() => setToast(null), options.duration || 4200);
  }, []);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const value = useMemo(() => show, [show]);
  const toneIcon = toast?.tone === 'error' ? 'alert' : toast?.tone === 'success' ? 'checkCircle' : null;

  return (
    <ToastContext.Provider value={value}>
      {children}

      <div className="pointer-events-none fixed inset-x-0 bottom-[calc(5.9rem+env(safe-area-inset-bottom))] z-[90] flex justify-center px-4 md:bottom-8">
        <AnimatePresence>
          {toast ? (
            <motion.div
              key={toast.key}
              role={toast.tone === 'error' ? 'alert' : 'status'}
              aria-live="polite"
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.98 }}
              transition={SPRING}
              className="glass pointer-events-auto flex max-w-full items-center gap-2.5 rounded-full py-2 pl-3.5 pr-2 text-ink"
            >
              {toneIcon ? (
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                    toast.tone === 'error'
                      ? 'bg-rose/15 text-rose'
                      : 'bg-mint/15 text-mint'
                  }`}
                >
                  <Icon name={toneIcon} size={15} strokeWidth={1.9} />
                </span>
              ) : (
                <span className="ml-1 h-1.5 w-1.5 shrink-0 rounded-full bg-violet" aria-hidden="true" />
              )}

              <span className="py-1 text-[13.5px] font-medium text-ink">{toast.message}</span>

              {toast.action ? (
                <button
                  type="button"
                  onClick={() => {
                    toast.action.onClick();
                    dismiss();
                  }}
                  className="ml-1 flex h-8 items-center gap-1.5 rounded-full bg-violet/15 px-3 text-[12.5px] font-semibold text-violet transition-colors hover:bg-violet/25"
                >
                  {toast.action.icon ? <Icon name={toast.action.icon} size={14} /> : null}
                  {toast.action.label}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={dismiss}
                  aria-label="Dismiss notification"
                  className="flex h-8 w-8 items-center justify-center rounded-full text-ink-3 transition-colors hover:bg-ink/[0.06] hover:text-ink"
                >
                  <Icon name="x" size={14} />
                </button>
              )}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
