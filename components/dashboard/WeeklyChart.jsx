'use client';

import { motion } from 'framer-motion';

const SPRING = { type: 'spring', bounce: 0, duration: 0.7 };

export default function WeeklyChart({ days, max, total }) {
  const summary = days.map((day) => `${day.label} ${day.count}`).join(', ');

  return (
    <div>
      <div
        className="flex items-end gap-1.5"
        role="img"
        aria-label={`Completions in the last seven days: ${summary}`}
      >
        {days.map((day, index) => {
          const height = day.count ? Math.max(12, (day.count / max) * 100) : 0;

          return (
            <div key={day.key} className="flex min-w-0 flex-1 flex-col items-center gap-2">
              <div
                className={`relative flex h-[66px] w-full items-end justify-center rounded-lg ${
                  day.count > 0 ? 'bg-ink/[0.03]' : ''
                }`}
              >
                {day.count > 0 ? (
                  <motion.span
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{ ...SPRING, delay: index * 0.04 }}
                    className={`w-full max-w-[20px] rounded-full ${
                      day.isToday
                        ? 'bg-gradient-to-t from-cyan-deep/45 to-cyan'
                        : 'bg-gradient-to-t from-violet-deep/40 to-violet/80'
                    }`}
                    title={`${day.count} completed ${day.label}`}
                  />
                ) : (
                  <span className="mb-2 h-1 w-1 rounded-full bg-ink/15" aria-hidden="true" />
                )}
              </div>
              <span
                className={`text-[10px] font-medium ${
                  day.isToday ? 'text-cyan' : 'text-ink-3'
                }`}
              >
                {day.short}
              </span>
            </div>
          );
        })}
      </div>

      <p className="mt-3 text-[11px] leading-4 text-ink-3">
        {total > 0
          ? `${total} completed in the last 7 days`
          : 'No completions logged this week'}
      </p>
    </div>
  );
}
