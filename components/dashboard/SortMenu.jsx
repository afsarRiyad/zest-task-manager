'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Icon from '@/components/Icon';
import { SORT_OPTIONS } from '@/lib/theme';

const SPRING = { type: 'spring', bounce: 0, duration: 0.3 };

export default function SortMenu({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const triggerRef = useRef(null);
  const selected = SORT_OPTIONS.find((option) => option.value === value) || SORT_OPTIONS[0];

  useEffect(() => {
    if (!open) return undefined;

    const handlePointerDown = (event) => {
      if (!wrapRef.current?.contains(event.target)) setOpen(false);
    };
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  return (
    <div className="relative" ref={wrapRef}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Sort: ${selected.label}`}
        className={`flex h-10 items-center gap-2 rounded-full border px-3 text-[12.5px] font-medium transition-colors ${
          open
            ? 'border-line-strong bg-ink/[0.06] text-ink'
            : 'border-line bg-ink/[0.025] text-ink-2 hover:border-line-strong hover:text-ink'
        }`}
      >
        <Icon name="sort" size={14} className="text-ink-3" />
        <span className="hidden sm:inline">{selected.label}</span>
        <Icon name="chevronDown" size={12} className="hidden text-ink-3 sm:block" />
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            role="listbox"
            aria-label="Sort tasks"
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={SPRING}
            style={{ transformOrigin: 'top right' }}
            className="glass absolute right-0 top-[calc(100%+8px)] z-50 w-[190px] rounded-2xl p-1.5"
          >
            {SORT_OPTIONS.map((option) => {
              const active = option.value === value;

              return (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={active}
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                  className={`flex h-9 w-full items-center justify-between rounded-xl px-2.5 text-[12.5px] transition-colors ${
                    active
                      ? 'bg-ink/[0.055] font-medium text-ink'
                      : 'text-ink-2 hover:bg-ink/[0.04] hover:text-ink'
                  }`}
                >
                  {option.label}
                  {active ? <Icon name="check" size={13} className="text-violet" /> : null}
                </button>
              );
            })}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
