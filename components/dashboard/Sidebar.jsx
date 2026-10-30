'use client';

import { motion } from 'framer-motion';
import Logo from '@/components/Logo';
import Icon from '@/components/Icon';
import ProfileMenu from '@/components/dashboard/ProfileMenu';
import { CATEGORY_COLORS } from '@/lib/theme';

const SPRING = { type: 'spring', bounce: 0, duration: 0.34 };

const NAV = [
  { id: 'overview', label: 'Overview', icon: 'overview', countKey: 'open' },
  { id: 'tasks', label: 'My Tasks', icon: 'list', countKey: 'total' },
  { id: 'today', label: 'Today', icon: 'sun', countKey: 'today' },
  { id: 'upcoming', label: 'Upcoming', icon: 'calendar', countKey: 'upcoming' },
  { id: 'completed', label: 'Completed', icon: 'checkCircle', countKey: 'completed' },
];

export default function Sidebar({
  view,
  counts,
  categories,
  categoryCounts,
  categoryId,
  onNavigate,
  onSelectCategory,
  onNewCategory,
  onNewTask,
  onSettings,
  onSignOut,
  user,
}) {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-[252px] flex-col border-r border-line bg-surface/95 backdrop-blur-xl lg:flex">
      <div className="flex h-[76px] shrink-0 items-center px-5">
        <Logo size="md" />
      </div>

      <div className="px-4">
        <button
          type="button"
          onClick={onNewTask}
          className="group flex h-11 w-full items-center justify-between rounded-xl border border-accent/25 bg-accent/[0.08] px-3.5 text-[13px] font-semibold text-accent transition-colors hover:border-accent/40 hover:bg-accent/[0.13]"
        >
          <span className="flex items-center gap-2">
            <Icon name="plus" size={17} strokeWidth={2} />
            New task
          </span>
          <span className="flex h-6 min-w-6 items-center justify-center rounded-md border border-accent/20 bg-accent/10 px-1.5 text-[10px] font-semibold text-accent/80 transition-colors group-hover:text-accent">
            N
          </span>
        </button>
      </div>

      <nav className="mt-6 flex-1 overflow-y-auto overflow-x-hidden px-3 pb-4 no-scrollbar">
        <p className="label-caps mb-2 px-3">Workspace</p>

        <div className="space-y-0.5">
          {NAV.map((item) => {
            const active = view === item.id;
            const count = counts[item.countKey] || 0;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                aria-current={active ? 'page' : undefined}                  className={`relative flex h-10 w-full items-center gap-2.5 rounded-xl px-3 text-[13px] font-medium transition-colors ${
                  active ? 'text-ink' : 'text-ink-2 hover:bg-ink/[0.035] hover:text-ink'
                }`}
              >
                {active ? (
                  <motion.span
                    layoutId="sidebar-active"
                    transition={SPRING}
                    className="absolute inset-0 rounded-xl border border-ink/[0.06] bg-ink/[0.055]"
                    aria-hidden="true"
                  />
                ) : null}
                <Icon
                  name={item.icon}
                  size={17}
                  strokeWidth={active ? 1.9 : 1.65}
                  className={`relative z-10 ${active ? 'text-violet' : 'text-ink-3'}`}
                />
                <span className="relative z-10 flex-1 text-left">{item.label}</span>
                {count > 0 ? (
                  <span
                    className={`relative z-10 text-[11px] font-medium tabular-nums ${
                      active ? 'text-ink-2' : 'text-ink-3'
                    }`}
                  >
                    {count}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>

        <div className="mt-7 flex h-6 items-center justify-between px-3">
          <p className="label-caps">Categories</p>
          <button
            type="button"
            onClick={onNewCategory}
            aria-label="New category"
            className="flex h-7 w-7 -mr-1 items-center justify-center rounded-lg text-ink-3 transition-colors hover:bg-ink/[0.06] hover:text-ink"
          >
            <Icon name="plus" size={15} />
          </button>
        </div>

        <div className="mt-1.5 space-y-0.5">
          {categories.map((category) => {
            const active = categoryId === category.id;
            const count = categoryCounts.get(category.id)?.open || 0;

            return (
              <button
                key={category.id}
                type="button"
                onClick={() => onSelectCategory(category.id)}
                aria-pressed={active}
                className={`flex h-9 w-full items-center gap-2.5 rounded-xl px-3 text-[12.5px] transition-colors ${
                  active
                    ? 'bg-ink/[0.045] font-medium text-ink'
                    : 'text-ink-2 hover:bg-ink/[0.03] hover:text-ink'
                }`}
              >
                <span
                  className="h-[7px] w-[7px] shrink-0 rounded-full"
                  style={{ backgroundColor: CATEGORY_COLORS[category.color] }}
                  aria-hidden="true"
                />
                <span className="min-w-0 flex-1 truncate text-left">{category.name}</span>
                {count > 0 ? (
                  <span className="text-[10.5px] tabular-nums text-ink-3">{count}</span>
                ) : null}
              </button>
            );
          })}

          {categories.length === 0 ? (
            <button
              type="button"
              onClick={onNewCategory}
              className="flex h-9 w-full items-center gap-2 rounded-xl px-3 text-[12px] text-ink-3 transition-colors hover:text-ink"
            >
              <Icon name="plus" size={13} />
              Add a category
            </button>
          ) : null}
        </div>

        <div className="mt-6 border-t border-line pt-3">
          <button
            type="button"
            onClick={onSettings}
            className="flex h-10 w-full items-center gap-2.5 rounded-xl px-3 text-[13px] font-medium text-ink-2 transition-colors hover:bg-ink/[0.035] hover:text-ink"
          >
            <Icon name="settings" size={17} className="text-ink-3" />
            Settings
          </button>
        </div>
      </nav>

      <div className="shrink-0 border-t border-line p-3">
        <ProfileMenu
          user={user}
          onSettings={onSettings}
          onSignOut={onSignOut}
          placement="top"
        />
      </div>
    </aside>
  );
}
