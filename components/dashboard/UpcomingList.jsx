'use client';

import { format, parseISO } from 'date-fns';
import Icon from '@/components/Icon';
import { CATEGORY_COLORS } from '@/lib/theme';

export default function UpcomingList({
  tasks,
  categories,
  onEdit,
  onAdd,
}) {
  const categoryMap = new Map(categories.map((category) => [category.id, category]));

  if (!tasks.length) {
    return (
      <div className="rounded-xl border border-dashed border-ink/10 px-3.5 py-3.5">
        <p className="text-[12.5px] font-medium text-ink-2">Nothing on the horizon.</p>
        <p className="mt-1 text-[11.5px] leading-4 text-ink-3">
          Add a due date when something needs a deadline.
        </p>
        {onAdd ? (
          <button
            type="button"
            onClick={onAdd}
            className="mt-2.5 inline-flex items-center gap-1 text-[11.5px] font-semibold text-violet transition-colors hover:text-violet-dim"
          >
            Add a task
            <Icon name="arrowRight" size={12} />
          </button>
        ) : null}
      </div>
    );
  }

  return (
    <div className="space-y-0.5">
      {tasks.map((task) => {
        const due = parseISO(task.dueAt);
        const category = categoryMap.get(task.categoryId);
        const color = category ? CATEGORY_COLORS[category.color] : 'rgb(var(--ink-3))';

        return (
          <button
            key={task.id}
            type="button"
            onClick={() => onEdit(task)}
            className="group flex w-full items-center gap-2.5 rounded-xl px-2 py-2 text-left transition-colors hover:bg-ink/[0.035]"
          >
            <span className="flex h-10 w-9 shrink-0 flex-col items-center justify-center rounded-lg border border-line bg-ink/[0.025]">
              <span className="text-[8px] font-semibold uppercase tracking-[0.08em] text-ink-3">
                {format(due, 'MMM')}
              </span>
              <span className="font-display text-[14px] font-semibold leading-4 text-ink">
                {format(due, 'd')}
              </span>
            </span>

            <span className="min-w-0 flex-1">
              <span className="block truncate text-[12.5px] font-medium text-ink">
                {task.title}
              </span>
              <span className="mt-0.5 flex items-center gap-1.5 text-[10.5px] text-ink-3">
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: color }}
                  aria-hidden="true"
                />
                <span className="truncate">{category?.name || 'Uncategorized'}</span>
                <span aria-hidden="true">·</span>
                <span>{format(due, 'h:mm a')}</span>
              </span>
            </span>

            <Icon
              name="chevronRight"
              size={14}
              className="shrink-0 text-ink-3 opacity-0 transition-opacity group-hover:opacity-100"
            />
          </button>
        );
      })}
    </div>
  );
}
