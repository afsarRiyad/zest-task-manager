'use client';

import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Icon from '@/components/Icon';

const SPRING = { type: 'spring', bounce: 0, duration: 0.34 };

export default function SearchField({ open, value, onChange, onClose }) {
  const inputRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const timer = window.setTimeout(() => inputRef.current?.focus(), 60);
    return () => window.clearTimeout(timer);
  }, [open]);

  return (
    <AnimatePresence initial={false}>
      {open ? (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={SPRING}
          className="overflow-hidden"
        >
          <div className="pt-2.5">
            <div className="relative">
              <Icon
                name="search"
                size={16}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-3"
              />

              <input
                ref={inputRef}
                value={value}
                onChange={(event) => onChange(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Escape') {
                    event.preventDefault();
                    onClose();
                  }
                }}
                type="search"
                placeholder="Search titles and notes"
                aria-label="Search tasks"
                className="h-11 w-full rounded-full border border-line bg-ink/[0.03] pl-10 pr-[86px] text-[13px] font-medium text-ink outline-none transition-colors placeholder:text-ink-3 focus:border-violet/40 focus:bg-ink/[0.045] focus:ring-4 focus:ring-violet/10 [&::-webkit-search-cancel-button]:hidden"
              />

              <div className="absolute right-1.5 top-1/2 flex -translate-y-1/2 items-center gap-0.5">
                {value ? (
                  <button
                    type="button"
                    onClick={() => {
                      onChange('');
                      inputRef.current?.focus();
                    }}
                    aria-label="Clear search"
                    className="flex h-8 w-8 items-center justify-center rounded-full text-ink-3 transition-colors hover:bg-ink/[0.06] hover:text-ink"
                  >
                    <Icon name="x" size={13} />
                  </button>
                ) : null}
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close search"
                  className="flex h-8 items-center rounded-full px-2 text-[11px] font-medium text-ink-3 transition-colors hover:bg-ink/[0.06] hover:text-ink"
                >
                  Esc
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
