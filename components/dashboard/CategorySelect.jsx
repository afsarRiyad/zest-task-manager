'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Icon from '@/components/Icon';
import Sheet from '@/components/ui/Sheet';
import { useIsMobile } from '@/lib/useMediaQuery';
import { CATEGORY_COLORS } from '@/lib/theme';

const SPRING = { type: 'spring', bounce: 0, duration: 0.34 };

export default function CategorySelect({
  categories,
  categoryCounts,
  activeId,
  totalOpen,
  onChange,
  onCreate,
}) {
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();
  const wrapRef = useRef(null);
  const triggerRef = useRef(null);
  const active = categories.find((category) => category.id === activeId);

  useEffect(() => {
    if (!open || isMobile) return undefined;

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
  }, [open, isMobile]);

  function choose(id) {
    onChange(id);
    setOpen(false);
    window.setTimeout(() => triggerRef.current?.focus(), 40);
  }

  function create() {
    setOpen(false);
    window.setTimeout(onCreate, 140);
  }

  const list = (
    <CategoryList
      categories={categories}
      categoryCounts={categoryCounts}
      activeId={activeId}
      totalOpen={totalOpen}
      onChoose={choose}
      onCreate={create}
    />
  );

  return (
    <div className="relative min-w-0" ref={wrapRef}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="dialog"
        aria-expanded={open}
        className={`flex h-10 max-w-[190px] items-center gap-2 rounded-full border px-3 text-[12.5px] font-medium transition-colors ${
          open || active
            ? 'border-violet/30 bg-violet/[0.09] text-ink'
            : 'border-line bg-ink/[0.025] text-ink-2 hover:border-line-strong hover:text-ink'
        }`}
      >
        {active ? (
          <span
            className="h-2 w-2 shrink-0 rounded-full"
            style={{ backgroundColor: CATEGORY_COLORS[active.color] }}
            aria-hidden="true"
          />
        ) : (
          <Icon name="overview" size={14} className="shrink-0 text-ink-3" />
        )}
        <span className="min-w-0 truncate">{active?.name || 'All categories'}</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={SPRING}
          className="ml-0.5 flex shrink-0 text-ink-3"
        >
          <Icon name="chevronDown" size={13} />
        </motion.span>
      </button>

      {isMobile ? (
        <Sheet
          open={open}
          onClose={() => setOpen(false)}
          title="Categories"
          eyebrow="Filter your list"
          description="Keep the view narrow when the day is loud."
        >
          {list}
        </Sheet>
      ) : (
        <AnimatePresence>
          {open ? (
            <motion.div
              initial={{ opacity: 0, y: -8, scaleX: 0.96, scaleY: 0.92 }}
              animate={{ opacity: 1, y: 0, scaleX: 1, scaleY: 1 }}
              exit={{ opacity: 0, y: -6, scaleX: 0.98, scaleY: 0.96 }}
              transition={SPRING}
              style={{ transformOrigin: 'top left' }}
              className="glass absolute left-0 top-[calc(100%+9px)] z-50 w-[312px] rounded-2xl p-1.5"
            >
              {list}
            </motion.div>
          ) : null}
        </AnimatePresence>
      )}
    </div>
  );
}

function CategoryList({
  categories,
  categoryCounts,
  activeId,
  totalOpen,
  onChoose,
  onCreate,
}) {
  const rows = [
    { id: 'all', name: 'All categories', icon: 'overview', color: null, count: totalOpen },
    ...categories.map((category) => ({
      ...category,
      count: categoryCounts.get(category.id)?.open || 0,
    })),
  ];

  return (
    <div role="group" aria-label="Filter by category">
      <p className="px-2.5 pb-1.5 pt-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-3">
        Filter by category
      </p>

      <div className="max-h-[310px] space-y-0.5 overflow-y-auto no-scrollbar">
        {rows.map((row) => {
          const active = activeId === row.id;
          const hex = row.color ? CATEGORY_COLORS[row.color] : null;

          return (
            <button
              key={row.id}
              type="button"
              onClick={() => onChoose(row.id)}
              aria-pressed={active}
              className={`relative flex h-11 w-full items-center gap-2.5 rounded-xl px-2.5 text-[12.5px] transition-colors ${
                active ? 'text-ink' : 'text-ink-2 hover:bg-ink/[0.045] hover:text-ink'
              }`}
            >
              {active ? (
                <motion.span
                  layoutId="category-select-active"
                  transition={SPRING}
                  className="absolute inset-0 rounded-xl border border-violet/15 bg-violet/[0.1]"
                  aria-hidden="true"
                />
              ) : null}

              <span
                className="relative z-10 grid h-7 w-7 shrink-0 place-items-center rounded-lg border border-ink/[0.05]"
                style={{
                  backgroundColor: hex ? `${hex}14` : 'rgb(var(--ink) / 0.04)',
                  color: hex || 'rgb(var(--ink-3))',
                }}
              >
                <Icon name={row.icon} size={14} strokeWidth={1.8} />
              </span>

              <span className="relative z-10 min-w-0 flex-1 truncate text-left">{row.name}</span>

              <span className="relative z-10 text-[10.5px] tabular-nums text-ink-3">
                {row.count}
              </span>

              {active ? (
                <span className="relative z-10 flex text-violet">
                  <Icon name="check" size={13} strokeWidth={2.2} />
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      <div className="my-1 h-px bg-line" />

      <button
        type="button"
        onClick={onCreate}
        className="flex h-10 w-full items-center gap-2.5 rounded-xl px-2.5 text-[12.5px] font-medium text-ink-2 transition-colors hover:bg-ink/[0.045] hover:text-ink"
      >
        <span className="grid h-7 w-7 place-items-center rounded-lg border border-dashed border-ink/15 text-ink-3">
          <Icon name="plus" size={14} />
        </span>
        New category
      </button>
    </div>
  );
}
