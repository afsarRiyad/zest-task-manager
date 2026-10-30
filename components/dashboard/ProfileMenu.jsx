'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Avatar from '@/components/Avatar';
import Icon from '@/components/Icon';

const SPRING = { type: 'spring', bounce: 0, duration: 0.3 };

export default function ProfileMenu({
  user,
  onSettings,
  onSignOut,
  compact = false,
  placement = 'top',
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const triggerRef = useRef(null);

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

  if (!user) return null;

  return (
    <div className="relative" ref={wrapRef}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Open account menu"
        className={`group flex w-full items-center rounded-xl transition-colors hover:bg-ink/[0.05] ${
          compact ? 'h-10 w-10 justify-center' : 'gap-2.5 px-2 py-2'
        }`}
      >
        <Avatar name={user.name} size={compact ? 32 : 34} />
        {!compact ? (
          <>
            <span className="min-w-0 flex-1 text-left">
              <span className="block truncate text-[13px] font-semibold text-ink">{user.name}</span>
              <span className="mt-0.5 block truncate text-[11px] text-ink-3">{user.email}</span>
            </span>
            <Icon
              name="more"
              size={16}
              className="shrink-0 text-ink-3 transition-colors group-hover:text-ink-2"
            />
          </>
        ) : null}
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            role="menu"
            aria-label="Account"
            initial={{ opacity: 0, y: placement === 'top' ? 6 : -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: placement === 'top' ? 4 : -4, scale: 0.98 }}
            transition={SPRING}
            className={`glass absolute z-50 w-[252px] rounded-2xl p-1.5 ${
              placement === 'top' ? 'bottom-[calc(100%+9px)] left-0' : 'right-0 top-[calc(100%+9px)]'
            }`}
            style={{ transformOrigin: placement === 'top' ? 'bottom left' : 'top right' }}
          >
            <div className="flex items-center gap-2.5 rounded-xl px-2.5 py-2.5">
              <Avatar name={user.name} size={38} />
              <div className="min-w-0">
                <p className="truncate text-[13px] font-semibold text-ink">{user.name}</p>
                <p className="mt-0.5 truncate text-[11px] text-ink-3">{user.email}</p>
              </div>
            </div>

            <div className="my-1 h-px bg-line" />

            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false);
                onSettings();
              }}
              className="flex h-10 w-full items-center gap-2.5 rounded-xl px-2.5 text-[13px] font-medium text-ink-2 transition-colors hover:bg-ink/[0.06] hover:text-ink"
            >
              <Icon name="settings" size={17} />
              Settings
            </button>

            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false);
                onSignOut();
              }}
              className="flex h-10 w-full items-center gap-2.5 rounded-xl px-2.5 text-[13px] font-medium text-ink-2 transition-colors hover:bg-rose/10 hover:text-rose"
            >
              <Icon name="logout" size={17} />
              Sign out
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
