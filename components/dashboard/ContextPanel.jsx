'use client';

import Icon from '@/components/Icon';
import CompanionCard from '@/components/dashboard/CompanionCard';
import ProgressRing from '@/components/dashboard/ProgressRing';
import UpcomingList from '@/components/dashboard/UpcomingList';
import WeeklyChart from '@/components/dashboard/WeeklyChart';

export default function ContextPanel({
  companion,
  counts,
  todayProgress,
  week,
  upcoming,
  categories,
  insight,
  greet,
  onEdit,
  onNewTask,
  onSeeAll,
}) {
  const total = todayProgress.total;
  const done = todayProgress.done;
  const percent = todayProgress.percent;

  return (
    <div className="space-y-6">
      <CompanionCard companion={companion} greet={greet} onNewTask={onNewTask} />

      <section className="border-t border-line pt-5" aria-labelledby="daily-progress-title">
        <div className="flex items-center justify-between">
          <h3 id="daily-progress-title" className="label-caps">
            Daily progress
          </h3>
          <span className="text-[11px] font-medium tabular-nums text-ink-2">
            {total ? `${percent}%` : 'No plan yet'}
          </span>
        </div>

        <div className="mt-4 flex items-center gap-5">
          <ProgressRing value={percent} size={98} stroke={7}>
            <div className="text-center">
              <p className="font-display text-[22px] font-semibold leading-none tracking-[-0.04em] text-ink">
                {done}
                <span className="text-[13px] font-medium text-ink-3">/{total}</span>
              </p>
              <p className="mt-1 text-[9.5px] font-medium uppercase tracking-[0.1em] text-ink-3">
                done today
              </p>
            </div>
          </ProgressRing>

          <dl className="min-w-0 flex-1 space-y-3">
            <div className="flex items-baseline justify-between gap-2">
              <dt className="text-[11.5px] text-ink-2">Left today</dt>
              <dd className="font-display text-[15px] font-semibold tabular-nums text-ink">
                {total ? todayProgress.remaining : 0}
              </dd>
            </div>
            <div className="h-px bg-line" />
            <div className="flex items-baseline justify-between gap-2">
              <dt className="text-[11.5px] text-ink-2">Overdue</dt>
              <dd
                className={`font-display text-[15px] font-semibold tabular-nums ${
                  counts.overdue > 0 ? 'text-rose' : 'text-ink'
                }`}
              >
                {counts.overdue}
              </dd>
            </div>
          </dl>
        </div>

        {total === 0 ? (
          <button
            type="button"
            onClick={onNewTask}
            className="mt-4 flex h-9 w-full items-center justify-between rounded-xl border border-line bg-ink/[0.025] px-3 text-[11.5px] font-medium text-ink-2 transition-colors hover:border-line-strong hover:text-ink"
          >
            Plan one thing for today
            <Icon name="arrowRight" size={13} />
          </button>
        ) : (
          <p className="mt-4 text-[11.5px] leading-4 text-ink-3">
            {percent === 100
              ? "Today's plan is complete. The rest can wait."
              : `${todayProgress.remaining} left to close out today's plan.`}
          </p>
        )}
      </section>

      <section className="border-t border-line pt-5" aria-labelledby="upcoming-title">
        <div className="flex items-center justify-between">
          <h3 id="upcoming-title" className="label-caps">
            Upcoming
          </h3>
          <button
            type="button"
            onClick={onSeeAll}
            className="text-[11px] font-medium text-ink-3 transition-colors hover:text-ink"
          >
            See all
          </button>
        </div>
        <div className="mt-3">
          <UpcomingList
            tasks={upcoming}
            categories={categories}
            onEdit={onEdit}
            onAdd={onNewTask}
          />
        </div>
      </section>

      <section className="border-t border-line pt-5" aria-labelledby="week-title">
        <div className="flex items-baseline justify-between">
          <h3 id="week-title" className="label-caps">
            This week
          </h3>
          <span className="text-[11px] font-medium tabular-nums text-ink-2">
            {week.total} done
          </span>
        </div>
        <div className="mt-4">
          <WeeklyChart days={week.days} max={week.max} total={week.total} />
        </div>
      </section>

      <section className="rounded-2xl border border-line bg-ink/[0.025] p-3.5">
        <div className="flex items-center gap-2 text-violet">
          <Icon name="sparkles" size={14} strokeWidth={1.9} />
          <p className="label-caps !text-violet/80">A note from Nova</p>
        </div>
        <p className="mt-2 text-[11.5px] leading-[1.6] text-ink-2">{insight}</p>
      </section>
    </div>
  );
}
