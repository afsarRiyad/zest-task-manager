'use client';

import AnimeCompanion from '@/features/mascot/AnimeCompanion';
import Icon from '@/components/Icon';

const MOOD_META = {
  idle: { label: 'Right here', color: 'rgb(var(--accent))' },
  happy: { label: 'Good to see you', color: 'rgb(var(--lavender))' },
  cheer: { label: 'All clear', color: 'rgb(var(--mint))' },
  concerned: { label: 'Checking in', color: 'rgb(var(--amber))' },
  sleepy: { label: 'Winding down', color: 'rgb(var(--ink-3))' },
  focus: { label: 'In the zone', color: 'rgb(var(--accent))' },
};

export default function CompanionCard({ companion, greet = false, onNewTask }) {
  const meta = MOOD_META[companion.mood] || MOOD_META.idle;

  return (
    <section className="relative overflow-hidden rounded-panel border border-line bg-elevated">
      <div
        className="pointer-events-none absolute -inset-x-10 -top-24 h-[280px] bg-[radial-gradient(closest-side,rgb(var(--accent)/0.16),transparent)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            'linear-gradient(rgb(var(--ink) / 0.45) 1px, transparent 1px), linear-gradient(90deg, rgb(var(--ink) / 0.45) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          maskImage: 'radial-gradient(circle at 50% 24%, #000 0%, transparent 68%)',
          WebkitMaskImage: 'radial-gradient(circle at 50% 24%, #000 0%, transparent 68%)',
        }}
        aria-hidden="true"
      />

      <div className="relative flex items-start justify-between gap-3 px-5 pt-5">
        <div>
          <p className="label-caps">Focus companion</p>
          <h2 className="mt-1 font-display text-[19px] font-semibold tracking-[-0.035em] text-ink">
            Nova
          </h2>
        </div>

        <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-ink/[0.035] px-2.5 py-1 text-[10px] font-medium text-ink-2">
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: meta.color }}
            aria-hidden="true"
          />
          {meta.label}
        </span>
      </div>

      <div className="relative mt-0.5 flex h-[224px] items-end justify-center overflow-hidden">
        <AnimeCompanion
          mood={companion.mood}
          greet={greet}
          allDone={companion.allDone}
          variant="portrait"
          className="h-[224px] w-auto"
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-elevated via-elevated/70 to-transparent"
          aria-hidden="true"
        />
      </div>

      <div className="relative -mt-2 px-4 pb-4">
        <div className="rounded-2xl border border-ink/[0.07] bg-surface/85 p-3.5 shadow-panel backdrop-blur-md">
          <p className="text-[13px] leading-[1.55] text-ink-2">{companion.message}</p>
        </div>

        {companion.counts.total === 0 ? (
          <button
            type="button"
            onClick={onNewTask}
            className="mt-3 flex h-9 w-full items-center justify-between rounded-xl border border-violet/15 bg-violet/[0.07] px-3 text-[12px] font-semibold text-violet transition-colors hover:bg-violet/[0.12]"
          >
            Give me one thing to start
            <Icon name="arrowRight" size={14} />
          </button>
        ) : null}
      </div>
    </section>
  );
}
