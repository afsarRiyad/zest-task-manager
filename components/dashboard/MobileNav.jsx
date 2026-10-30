'use client';

import { motion } from 'framer-motion';
import Icon from '@/components/Icon';

const SPRING = { type: 'spring', bounce: 0, duration: 0.32 };

const ITEMS = [
  { id: 'overview', label: 'Home', icon: 'overview' },
  { id: 'today', label: 'Today', icon: 'sun' },
  { id: 'upcoming', label: 'Upcoming', icon: 'calendar' },
  { id: 'completed', label: 'Done', icon: 'checkCircle' },
];

export default function MobileNav({ view, onNavigate, onNewTask }) {
  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-50 px-3 pb-[calc(10px+env(safe-area-inset-bottom))] lg:hidden"
    >
      <div className="glass mx-auto flex h-[66px] max-w-[520px] items-center rounded-[22px] px-2">
        {ITEMS.slice(0, 2).map((item) => (
          <NavItem key={item.id} item={item} active={view === item.id} onNavigate={onNavigate} />
        ))}

        <div className="relative flex w-[64px] shrink-0 justify-center">
          <button
            type="button"
            onClick={onNewTask}
            aria-label="New task"
            className="absolute -top-8 flex h-[54px] w-[54px] items-center justify-center rounded-full bg-accent text-on-accent shadow-soft transition-transform duration-200 active:scale-95"
          >
            <Icon name="plus" size={24} strokeWidth={2.2} />
          </button>
          <span className="mt-[38px] text-[9.5px] font-medium text-ink-3">Add</span>
        </div>

        {ITEMS.slice(2).map((item) => (
          <NavItem key={item.id} item={item} active={view === item.id} onNavigate={onNavigate} />
        ))}
      </div>
    </nav>
  );
}

function NavItem({ item, active, onNavigate }) {
  return (
    <button
      type="button"
      onClick={() => onNavigate(item.id)}
      aria-current={active ? 'page' : undefined}
      className={`relative flex h-full flex-1 flex-col items-center justify-center gap-1 rounded-xl transition-colors ${
        active ? 'text-ink' : 'text-ink-3'
      }`}
    >
      {active ? (
        <motion.span
          layoutId="mobile-nav-active"
          transition={SPRING}
          className="absolute inset-x-2 top-1.5 h-8 rounded-xl bg-ink/[0.055]"
          aria-hidden="true"
        />
      ) : null}
      <Icon
        name={item.icon}
        size={19}
        strokeWidth={active ? 1.95 : 1.65}
        className={`relative z-10 ${active ? 'text-violet' : ''}`}
      />
      <span className="relative z-10 text-[9.5px] font-medium">{item.label}</span>
    </button>
  );
}
