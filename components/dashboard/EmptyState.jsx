'use client';

import AnimeCompanion from '@/features/mascot/AnimeCompanion';
import Icon from '@/components/Icon';

export default function EmptyState({
  title,
  body,
  actionLabel,
  actionIcon = 'plus',
  onAction,
  secondaryLabel,
  onSecondary,
  mood = 'idle',
}) {
  return (
    <div className="rounded-panel border border-dashed border-ink/[0.1] bg-ink/[0.012] px-6 py-8 text-center sm:py-12">
      <div className="mx-auto hidden h-16 w-16 items-center justify-center overflow-hidden rounded-full border border-line bg-elevated/60 sm:flex">
        <AnimeCompanion mood={mood} variant="avatar" className="h-16 w-16" interactive={false} />
      </div>

      <h3 className="font-display text-[18px] font-semibold tracking-[-0.03em] text-ink sm:mt-4">
        {title}
      </h3>
      <p className="mx-auto mt-1.5 max-w-[38ch] text-[12.5px] leading-5 text-ink-3">{body}</p>

      <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
        {actionLabel ? (
          <button
            type="button"
            onClick={onAction}
            className="inline-flex h-9 items-center gap-1.5 rounded-full bg-accent px-4 text-[12px] font-semibold text-on-accent shadow-soft transition-colors hover:bg-accent-deep"
          >
            <Icon name={actionIcon} size={14} strokeWidth={2.2} />
            {actionLabel}
          </button>
        ) : null}

        {secondaryLabel ? (
          <button
            type="button"
            onClick={onSecondary}
            className="inline-flex h-9 items-center rounded-full border border-line px-4 text-[12px] font-medium text-ink-2 transition-colors hover:border-line-strong hover:text-ink"
          >
            {secondaryLabel}
          </button>
        ) : null}
      </div>
    </div>
  );
}
