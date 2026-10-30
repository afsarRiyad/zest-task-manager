'use client';

import Avatar from '@/components/Avatar';
import ProgressRing from '@/components/dashboard/ProgressRing';
import AnimeCompanion from '@/features/mascot/AnimeCompanion';
import Icon from '@/components/Icon';

const TASKS = [
  {
    title: 'Outline the launch note',
    meta: 'Work · Today',
    color: '#5B8DEF',
    priority: '#E2556F',
    done: false,
  },
  {
    title: 'Book the studio session',
    meta: 'Personal · Tomorrow',
    color: '#8970E8',
    priority: '#D38A0F',
    done: false,
  },
  {
    title: 'Read 20 pages',
    meta: 'Study · 6:00 PM',
    color: '#2BA670',
    priority: '#2BA670',
    done: true,
  },
];

const NAV = ['overview', 'sun', 'calendar', 'checkCircle'];

export default function ProductPreview({ className = '' }) {
  return (
    <div className={`relative ${className}`}>
      <div
        className="pointer-events-none absolute -inset-8 rounded-[44px] bg-[radial-gradient(closest-side,rgb(var(--accent)/0.14),transparent)] blur-2xl"
        aria-hidden="true"
      />

      <div
        className="relative overflow-hidden rounded-[24px] border border-line bg-card shadow-[0_30px_80px_rgb(var(--shadow-color)/0.14),0_1px_0_rgb(255_255_255/0.6)_inset]"
        role="img"
        aria-label="Preview of the Zest dashboard with a task list, companion and weekly progress"
      >
        <div className="flex h-10 items-center gap-2 border-b border-line px-3">
          <div className="flex gap-1.5">
            <span className="h-2 w-2 rounded-full bg-ink/10" />
            <span className="h-2 w-2 rounded-full bg-ink/10" />
            <span className="h-2 w-2 rounded-full bg-ink/10" />
          </div>
          <div className="mx-auto flex h-5 items-center rounded-md border border-line/60 bg-ink/[0.025] px-3 text-[8px] text-ink-3">
            zest.app / today
          </div>
          <Avatar name="Maya Chen" size={18} ring={false} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-[58px_minmax(0,1fr)] md:grid-cols-[58px_minmax(0,1fr)_146px]">
          <div className="hidden flex-col items-center border-r border-line py-3 sm:flex">
            <span
              className="grid h-7 w-7 place-items-center rounded-[9px] bg-gradient-to-br from-[#FFA45C] to-[#E85D18]"
              aria-hidden="true"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2.4c.7 5.2 3.2 7.7 8.4 8.4-5.2.7-7.7 3.2-8.4 8.4-.7-5.2-3.2-7.7-8.4-8.4C8.8 10.1 11.3 7.6 12 2.4Z"
                  fill="#FFFFFF"
                />
              </svg>
            </span>

            <div className="mt-5 space-y-1">
              {NAV.map((icon, index) => (
                <span
                  key={icon}
                  className={`grid h-7 w-7 place-items-center rounded-lg ${
                    index === 0
                      ? 'border border-ink/[0.06] bg-ink/[0.06] text-violet'
                      : 'text-ink-3'
                  }`}
                >
                  <Icon name={icon} size={12} strokeWidth={1.8} />
                </span>
              ))}
            </div>

            <div className="mt-5 space-y-2">
              {['#8970E8', '#5B8DEF', '#2BA670', '#E2556F'].map((color) => (
                <span
                  key={color}
                  className="block h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: color, opacity: 0.7 }}
                />
              ))}
            </div>
          </div>

          <div className="min-w-0 p-4 sm:p-5">
            <p className="text-[7.5px] font-semibold uppercase tracking-[0.16em] text-ink-3">
              Wednesday, Oct 29
            </p>
            <h3 className="mt-1 font-display text-[19px] font-semibold leading-tight tracking-[-0.045em] text-ink">
              Good evening, Maya.
            </h3>
            <p className="mt-1 text-[8.5px] text-ink-2">2 left today · 1 overdue</p>

            <div className="mt-3 flex items-center gap-2">
              <div className="h-1 flex-1 overflow-hidden rounded-full bg-ink/[0.05]">
                <div className="h-full w-[58%] rounded-full bg-gradient-to-r from-violet-deep via-violet to-cyan/70" />
              </div>
              <span className="text-[7.5px] tabular-nums text-ink-3">3/5 today</span>
            </div>

            <div className="mt-4 flex items-center gap-1.5">
              <span className="inline-flex h-7 items-center gap-1.5 rounded-full border border-violet/25 bg-violet/[0.09] px-2 text-[8px] font-medium text-ink">
                <span className="h-1 w-1 rounded-full bg-violet" />
                All categories
                <Icon name="chevronDown" size={9} className="text-ink-3" />
              </span>
              <span className="grid h-7 w-7 place-items-center rounded-full border border-line bg-ink/[0.02] text-ink-3">
                <Icon name="search" size={10} />
              </span>
              <span className="ml-auto inline-flex h-7 items-center gap-1 rounded-full border border-line bg-ink/[0.02] px-2 text-[8px] text-ink-3">
                <Icon name="sort" size={9} />
                Smart
              </span>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <p className="text-[8px] font-semibold text-ink">Your list</p>
              <span className="text-[7px] text-ink-3">2 open</span>
            </div>

            <div className="mt-1.5 space-y-1.5">
              {TASKS.map((task) => (
                <div
                  key={task.title}
                  className="flex items-center gap-2 rounded-lg border border-line/70 bg-canvas px-2 py-2"
                >
                  <span
                    className={`grid h-3.5 w-3.5 shrink-0 place-items-center rounded-full border ${
                      task.done                          ? 'border-accent bg-accent text-on-accent'
                        : 'border-ink/20 text-transparent'
                    }`}
                  >
                    <Icon name="check" size={8} strokeWidth={3} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p
                      className={`truncate text-[9px] font-medium ${
                        task.done ? 'text-ink-3 line-through' : 'text-ink'
                      }`}
                    >
                      {task.title}
                    </p>
                    <p className="mt-0.5 flex items-center gap-1 text-[7px] text-ink-3">
                      <span
                        className="h-1 w-1 rounded-full"
                        style={{ backgroundColor: task.color }}
                      />
                      {task.meta}
                    </p>
                  </div>
                  <span
                    className="h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ backgroundColor: task.priority }}
                  />
                </div>
              ))}
            </div>

            <div className="mt-3 flex items-center justify-between border-t border-line pt-2.5">
              <p className="text-[7.5px] font-semibold uppercase tracking-[0.12em] text-ink-3">
                Done today
              </p>
              <div className="flex -space-x-1">
                {['#8970E8', '#5B8DEF', '#2BA670'].map((color) => (
                  <span
                    key={color}
                    className="h-3 w-3 rounded-full border border-card"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="hidden border-l border-line p-3 md:block">
            <div className="relative overflow-hidden rounded-xl border border-line bg-gradient-to-b from-elevated to-card p-2">
              <div className="flex items-center justify-between">
                <p className="text-[7px] font-semibold uppercase tracking-[0.12em] text-ink-3">
                  Nova
                </p>
                <span className="h-1.5 w-1.5 rounded-full bg-mint" />
              </div>
              <div className="mt-1 flex h-[104px] items-end justify-center overflow-hidden">
                <AnimeCompanion
                  mood="happy"
                  variant="avatar"
                  className="h-[94px] w-[94px]"
                  interactive={false}
                />
              </div>
              <p className="rounded-lg border border-line bg-canvas px-2 py-1.5 text-[7.5px] leading-3 text-ink-2">
                One down. The list just got lighter.
              </p>
            </div>

            <div className="mt-2 flex items-center gap-2">
              <ProgressRing value={60} size={42} stroke={4}>
                <span className="text-[8px] font-semibold tabular-nums text-ink">3/5</span>
              </ProgressRing>
              <div>
                <p className="text-[7px] uppercase tracking-[0.1em] text-ink-3">Today</p>
                <p className="text-[8px] text-ink-2">3 of 5 done</p>
              </div>
            </div>

            <div className="mt-2.5 border-t border-line pt-2.5">
              <p className="text-[7px] font-semibold uppercase tracking-[0.12em] text-ink-3">
                Upcoming
              </p>
              <div className="mt-2 space-y-2">
                {[
                  ['02', 'Nov', 'Send the follow-up'],
                  ['05', 'Nov', 'Review the deck'],
                ].map(([day, month, title]) => (
                  <div key={title} className="flex items-center gap-1.5">
                    <span className="flex h-6 w-6 flex-col items-center justify-center rounded border border-line bg-ink/[0.02]">
                      <span className="text-[5px] uppercase text-ink-3">{month}</span>
                      <span className="text-[7px] font-semibold leading-[7px] text-ink">{day}</span>
                    </span>
                    <span className="min-w-0 flex-1 truncate text-[7.5px] text-ink-2">{title}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
