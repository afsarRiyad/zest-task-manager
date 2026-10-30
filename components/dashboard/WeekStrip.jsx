'use client';

import { addDays, format, isSameDay, startOfDay } from 'date-fns';
import Icon from '@/components/Icon';

export default function WeekStrip({ now, tasks, onPick }) {
  const start = startOfDay(now);
  const days = Array.from({ length: 7 }, (_, index) => {
    const date = addDays(start, index);
    const due = tasks.filter(
      (task) => !task.completed && task.dueAt && isSameDay(new Date(task.dueAt), date)
    );

    return {
      date,
      label: index === 0 ? 'Today' : format(date, 'EEE'),
      day: format(date, 'd'),
      count: due.length,
      overdue: due.some((task) => new Date(task.dueAt).getTime() < now.getTime()),
      isToday: index === 0,
    };
  });

  return (
    <section className="mt-9 border-t border-line pt-5" aria-labelledby="week-plan-title">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="label-caps">Plan the week</p>
          <h2
            id="week-plan-title"
            className="mt-1 font-display text-[16px] font-semibold tracking-[-0.025em] text-ink"
          >
            Pick a day to add something
          </h2>
        </div>
        <p className="hidden text-[10.5px] text-ink-3 sm:block">
          {format(now, 'MMMM')}
        </p>
      </div>

      <div className="mt-3 grid grid-cols-7 gap-1.5">
        {days.map((day) => (
          <button
            key={day.date.toISOString()}
            type="button"
            onClick={() => onPick(day.date)}
            aria-label={`Add a task for ${format(day.date, 'EEEE, MMM d')}`}
            className={`group flex h-[70px] flex-col items-center justify-center gap-1 rounded-xl border text-center transition-colors ${
              day.isToday
                ? 'border-violet/25 bg-violet/[0.07] text-ink'
                : 'border-line bg-ink/[0.015] text-ink-2 hover:border-line-strong hover:bg-ink/[0.035] hover:text-ink'
            }`}
          >
            <span className="text-[9.5px] font-medium uppercase tracking-[0.08em] text-ink-3">
              {day.label}
            </span>
            <span className="font-display text-[15px] font-semibold leading-none tabular-nums">
              {day.day}
            </span>
            <span className="flex h-2 items-center gap-0.5">
              {day.count ? (
                Array.from({ length: Math.min(day.count, 3) }, (_, index) => (
                  <span
                    key={index}
                    className={`h-1 w-1 rounded-full ${
                      day.overdue ? 'bg-rose' : day.isToday ? 'bg-violet' : 'bg-ink-3'
                    }`}
                  />
                ))
              ) : (
                <Icon
                  name="plus"
                  size={10}
                  className="text-transparent transition-colors group-hover:text-ink-3"
                />
              )}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
