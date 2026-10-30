'use client';

import { useState } from 'react';
import Icon from '@/components/Icon';

export default function QuickAdd({ categoryName, onAdd, onOpenDetails }) {
  const [value, setValue] = useState('');

  function submit(event) {
    event.preventDefault();
    const title = value.trim();
    if (!title) return;
    onAdd(title);
    setValue('');
  }

  return (
    <form
      onSubmit={submit}
      className="group flex h-11 items-center gap-2 rounded-xl border border-line bg-ink/[0.018] pl-3 pr-1.5 transition-colors focus-within:border-violet/40 focus-within:bg-ink/[0.03]"
    >
      <Icon name="plus" size={15} className="shrink-0 text-ink-3" strokeWidth={2} />

      <input
        value={value}
        onChange={(event) => setValue(event.target.value)}
        maxLength={140}
        placeholder={
          categoryName ? `Add to ${categoryName}…` : 'Add a task and press Enter…'
        }
        aria-label="Quick add a task"
        className="min-w-0 flex-1 bg-transparent text-[12.5px] text-ink outline-none placeholder:text-ink-3/80"
      />

      {value.trim() ? (
        <button
          type="submit"
          className="flex h-8 shrink-0 items-center rounded-lg bg-violet/15 px-3 text-[11px] font-semibold text-violet transition-colors hover:bg-violet/25"
        >
          Add
        </button>
      ) : (
        <span className="hidden shrink-0 items-center gap-1 pr-2 text-[10px] text-ink-3/70 sm:flex">
          <span className="rounded border border-line px-1 py-0.5 font-medium">↵</span>
          quick add
        </span>
      )}

      {onOpenDetails ? (
        <button
          type="button"
          onClick={onOpenDetails}
          className="hidden h-8 shrink-0 items-center rounded-lg px-2.5 text-[10.5px] font-medium text-ink-3 transition-colors hover:bg-ink/[0.05] hover:text-ink sm:flex"
        >
          Details
        </button>
      ) : null}
    </form>
  );
}
