'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { motion, useDragControls, useReducedMotion } from 'framer-motion';
import { useIsMobile } from '@/lib/useMediaQuery';
import Icon from '@/components/Icon';

const SPRING = { type: 'spring', bounce: 0, duration: 0.44 };
const EXIT_MS = 300;

let bodyLockCount = 0;
let bodyOverflowBeforeLock = '';

function lockBodyScroll() {
  if (typeof document === 'undefined') return;
  if (bodyLockCount === 0) bodyOverflowBeforeLock = document.body.style.overflow;
  bodyLockCount += 1;
  document.body.style.overflow = 'hidden';
}

function unlockBodyScroll() {
  if (typeof document === 'undefined') return;
  bodyLockCount = Math.max(0, bodyLockCount - 1);
  if (bodyLockCount === 0) document.body.style.overflow = bodyOverflowBeforeLock;
}

export default function Sheet({
  open,
  onClose,
  title,
  eyebrow,
  description,
  children,
  footer,
  width = 'md',
  className = '',
}) {
  const isMobile = useIsMobile();
  const reduceMotion = useReducedMotion();
  const titleId = useId();
  const panelRef = useRef(null);
  const restoreRef = useRef(null);
  const closeRef = useRef(onClose);
  const controls = useDragControls();

  // The sheet mounts on open and unmounts on a timer after close. Relying on
  // AnimatePresence here once left a transparent backdrop alive after the exit
  // animation, which silently swallowed every click on the page.
  const [mounted, setMounted] = useState(Boolean(open));

  useEffect(() => {
    closeRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (open) {
      setMounted(true);
      return undefined;
    }

    if (!mounted) return undefined;
    const timer = window.setTimeout(() => setMounted(false), reduceMotion ? 120 : EXIT_MS);
    return () => window.clearTimeout(timer);
  }, [open, mounted, reduceMotion]);

  useEffect(() => {
    if (!open) return undefined;

    restoreRef.current = document.activeElement;
    lockBodyScroll();

    const focusTimer = window.setTimeout(() => {
      const firstField = panelRef.current?.querySelector(
        'input:not([type="hidden"]), textarea, select, button:not([data-close])'
      );
      if (firstField) firstField.focus();
      else panelRef.current?.focus();
    }, 90);

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeRef.current();
        return;
      }

      if (event.key !== 'Tab' || !panelRef.current) return;

      const focusables = Array.from(
        panelRef.current.querySelectorAll(
          'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      ).filter((node) => node.offsetParent !== null);

      if (!focusables.length) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      window.clearTimeout(focusTimer);
      unlockBodyScroll();
      document.removeEventListener('keydown', handleKeyDown);
      if (restoreRef.current instanceof HTMLElement) restoreRef.current.focus?.();
    };
    // The close callback is kept in a ref so re-renders cannot steal focus.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!mounted) return null;

  const widthClass = width === 'lg' ? 'md:w-[520px]' : 'md:w-[448px]';
  const enter = reduceMotion ? { opacity: 0 } : isMobile ? { y: '100%' } : { x: '100%' };
  const resting = reduceMotion ? { opacity: 1 } : isMobile ? { y: 0 } : { x: 0 };

  return (
    <div
      className={`fixed inset-0 z-[80] ${open ? '' : 'pointer-events-none'}`}
      aria-hidden={open ? undefined : true}
    >
      <motion.button
        type="button"
        aria-label="Close panel"
        tabIndex={-1}
        initial={{ opacity: 0 }}
        animate={{ opacity: open ? 1 : 0 }}
        transition={{ duration: 0.22 }}
        onClick={onClose}
        className="absolute inset-0 h-full w-full bg-overlay/40 backdrop-blur-[3px]"
      />

      <motion.section
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        drag={isMobile && !reduceMotion ? 'y' : false}
        dragListener={false}
        dragControls={controls}
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0, bottom: 0.4 }}
        onDragEnd={(_, info) => {
          if (info.offset.y > 120 || info.velocity.y > 750) onClose();
        }}
        initial={enter}
        animate={open ? resting : enter}
        transition={SPRING}
        className={`glass absolute flex flex-col overflow-hidden outline-none ${
          isMobile
            ? 'inset-x-0 bottom-0 max-h-[94dvh] rounded-t-[28px]'
            : `bottom-0 right-0 top-0 h-dvh max-h-none rounded-l-[28px] ${widthClass}`
        } ${className}`}
      >
        {isMobile ? (
          <div
            onPointerDown={(event) => controls.start(event)}
            className="flex shrink-0 cursor-grab touch-none justify-center pb-1 pt-3"
          >
            <span className="h-1.5 w-10 rounded-full bg-ink/15" aria-hidden="true" />
          </div>
        ) : null}

        <header className="flex shrink-0 items-start justify-between gap-4 px-6 pb-4 pt-5 md:px-7 md:pt-7">
          <div className="min-w-0">
            {eyebrow ? <p className="label-caps">{eyebrow}</p> : null}
            <h2
              id={titleId}
              className="mt-1.5 font-display text-[24px] font-semibold leading-tight tracking-[-0.035em] text-ink"
            >
              {title}
            </h2>
            {description ? (
              <p className="mt-1.5 max-w-[36ch] text-[13.5px] leading-5 text-ink-2">
                {description}
              </p>
            ) : null}
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            data-close
            className="icon-btn -mr-1 -mt-1 h-10 w-10 bg-ink/[0.03]"
          >
            <Icon name="x" size={17} />
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 md:px-7">
          {children}
        </div>

        {footer ? (
          <footer className="shrink-0 border-t border-line bg-surface/85 px-6 pb-[calc(16px+env(safe-area-inset-bottom))] pt-4 backdrop-blur-xl md:px-7 md:pb-5">
            {footer}
          </footer>
        ) : (
          <div className="h-5 shrink-0" />
        )}
      </motion.section>
    </div>
  );
}
