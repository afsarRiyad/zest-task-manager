'use client';

import { useEffect, useId, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { addDays, format } from 'date-fns';
import Sheet from '@/components/ui/Sheet';
import Icon from '@/components/Icon';
import {
  dateInputValue,
  defaultDueTime,
  nextTimeSlot,
  timeInputValue,
  toIsoFromInputs,
} from '@/lib/dates';
import {
  CATEGORY_COLORS,
  PRIORITY_COLOR,
  PRIORITY_LABEL,
  PRIORITY_ORDER,
  TASK_NOTES_MAX,
  TASK_TITLE_MAX,
} from '@/lib/theme';

const SPRING = { type: 'spring', bounce: 0, duration: 0.34 };

function scheduleSummary(dateStr, timeStr) {
  if (!dateStr) return 'Add a due date';
  const [year, month, day] = dateStr.split('-').map(Number);
  const [hours, minutes] = (timeStr || '17:00').split(':').map(Number);
  const date = new Date(year, month - 1, day, hours, minutes);
  if (Number.isNaN(date.getTime())) return 'Add a due date';
  return format(date, 'EEE, MMM d · h:mm a');
}

export default function TaskSheet({
  open,
  task,
  categories,
  defaultCategoryId,
  initialDueAt = null,
  onClose,
  onSave,
  onDelete,
}) {
  const formId = useId();
  const priorityLayoutId = useId().replace(/:/g, '');

  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [categoryId, setCategoryId] = useState(null);
  const [priority, setPriority] = useState('medium');
  const [dateStr, setDateStr] = useState('');
  const [timeStr, setTimeStr] = useState('');
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [titleError, setTitleError] = useState('');

  useEffect(() => {
    if (!open) return;

    const initialCategory =
      task?.categoryId ?? defaultCategoryId ?? categories[0]?.id ?? null;

    setTitle(task?.title || '');
    setNotes(task?.notes || '');
    setCategoryId(initialCategory);
    setPriority(task?.priority || 'medium');

    const startDue = task?.dueAt || initialDueAt;
    const startDate = startDue ? dateInputValue(startDue) : '';
    const startTime = startDue ? timeInputValue(startDue) : '';

    setDateStr(startDate);
    setTimeStr(
      startTime === '00:00' ? defaultDueTime(startDate) : startTime
    );
    setScheduleOpen(Boolean(startDue));
    setTitleError('');
    // The sheet is a fresh draft each time it opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, task?.id, initialDueAt]);

  function applyQuickDate(days) {
    const now = new Date();
    const date = addDays(now, days);
    const dateValue = format(date, 'yyyy-MM-dd');
    const fallback = days === 0 ? nextTimeSlot(now) : '17:00';

    setDateStr(dateValue);
    setTimeStr((current) => current || fallback);
    setScheduleOpen(true);
  }

  function clearSchedule() {
    setDateStr('');
    setTimeStr('');
  }

  function handleSubmit(event) {
    event.preventDefault();
    const cleanTitle = title.trim();

    if (!cleanTitle) {
      setTitleError('Give this task a name.');
      return;
    }

    if (dateStr && !timeStr) {
      setTimeStr(defaultDueTime(dateStr));
    }

    const dueAt = dateStr ? toIsoFromInputs(dateStr, timeStr || defaultDueTime(dateStr)) : null;

    onSave({
      title: cleanTitle,
      notes: notes.trim(),
      categoryId,
      priority,
      dueAt,
    });
  }

  const footer = (
    <div className="flex items-center gap-2">
      {task ? (
        <button
          type="button"
          onClick={() => {
            onDelete(task);
            onClose();
          }}
          className="flex h-10 items-center gap-1.5 rounded-full px-2.5 text-[12px] font-medium text-ink-3 transition-colors hover:bg-rose/10 hover:text-rose"
        >
          <Icon name="trash" size={15} />
          <span className="hidden sm:inline">Delete</span>
        </button>
      ) : null}

      <div className="ml-auto flex items-center gap-2">
        <button
          type="button"
          onClick={onClose}
          className="btn-ghost h-11 px-3.5 text-[12.5px]"
        >
          Cancel
        </button>
        <button
          type="submit"
          form={formId}
          disabled={!title.trim()}
          className="btn-primary h-11 min-w-[124px] text-[13px] disabled:cursor-not-allowed disabled:opacity-40"
        >
          {task ? 'Save changes' : 'Save task'}
        </button>
      </div>
    </div>
  );

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title={task ? 'Edit task' : 'New task'}
      eyebrow={task ? 'Adjust the details' : 'Add to your day'}
      description={
        task
          ? 'Change what you need, then get back to it.'
          : 'One clear line is enough. The rest is optional.'
      }
      footer={footer}
    >
      <form id={formId} onSubmit={handleSubmit} className="space-y-6 pb-3">
        <div>
          <label htmlFor={`${formId}-title`} className="label-caps">
            Task
          </label>
          <input
            id={`${formId}-title`}
            value={title}
            onChange={(event) => {
              setTitle(event.target.value);
              if (titleError) setTitleError('');
            }}
            maxLength={TASK_TITLE_MAX}
            placeholder="What needs doing?"
            aria-invalid={Boolean(titleError)}
            aria-describedby={titleError ? `${formId}-title-error` : undefined}
            className={`mt-2 w-full border-b bg-transparent pb-3 font-display text-[23px] font-medium leading-tight tracking-[-0.035em] text-ink placeholder:text-ink-3/65 focus:outline-none ${
              titleError ? 'border-rose/60' : 'border-line focus:border-violet/50'
            }`}
          />
          {titleError ? (
            <p
              id={`${formId}-title-error`}
              role="alert"
              className="mt-2 text-[11.5px] font-medium text-rose"
            >
              {titleError}
            </p>
          ) : null}
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label htmlFor={`${formId}-notes`} className="label-caps">
              Notes
            </label>
            <span className="text-[10px] tabular-nums text-ink-3/60">
              {notes.length}/{TASK_NOTES_MAX}
            </span>
          </div>
          <textarea
            id={`${formId}-notes`}
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            maxLength={TASK_NOTES_MAX}
            rows={3}
            placeholder="Context, links, a tiny pep talk…"
            className="field-area mt-2"
          />
        </div>

        <div>
          <p className="label-caps">Category</p>
          <div className="mt-2 flex max-h-[104px] flex-wrap gap-1.5 overflow-y-auto no-scrollbar">
            <button
              type="button"
              onClick={() => setCategoryId(null)}
              aria-pressed={categoryId === null}
              className={`flex h-9 items-center gap-1.5 rounded-full border px-3 text-[11.5px] font-medium transition-colors ${
                categoryId === null
                  ? 'border-violet/30 bg-violet/10 text-ink'
                  : 'border-line bg-ink/[0.02] text-ink-2 hover:text-ink'
              }`}
            >
              <span className="h-1.5 w-1.5 rounded-full border border-ink-3" aria-hidden="true" />
              None
            </button>

            {categories.map((category) => {
              const active = categoryId === category.id;
              const hex = CATEGORY_COLORS[category.color];

              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setCategoryId(category.id)}
                  aria-pressed={active}
                  className={`flex h-9 items-center gap-1.5 rounded-full border px-3 text-[11.5px] font-medium transition-colors ${
                    active
                      ? 'border-violet/30 bg-violet/10 text-ink'
                      : 'border-line bg-ink/[0.02] text-ink-2 hover:text-ink'
                  }`}
                >
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: hex }}
                    aria-hidden="true"
                  />
                  {category.name}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <p className="label-caps">Priority</p>
          <div
            role="group"
            aria-label="Priority"
            className="mt-2 flex rounded-xl border border-line bg-ink/[0.02] p-1"
          >
            {PRIORITY_ORDER.slice()
              .reverse()
              .map((value) => {
                const active = priority === value;

                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setPriority(value)}
                    aria-pressed={active}
                    className={`relative flex h-9 flex-1 items-center justify-center rounded-lg text-[11.5px] font-medium transition-colors ${
                      active ? 'text-ink' : 'text-ink-3 hover:text-ink-2'
                    }`}
                  >
                    {active ? (
                      <motion.span
                        layoutId={`priority-${priorityLayoutId}`}
                        transition={SPRING}
                        className="absolute inset-0 rounded-lg border border-ink/[0.06] bg-ink/[0.065]"
                        aria-hidden="true"
                      />
                    ) : null}
                    <span className="relative z-10 flex items-center gap-1.5">
                      <span
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ backgroundColor: PRIORITY_COLOR[value] }}
                        aria-hidden="true"
                      />
                      {PRIORITY_LABEL[value]}
                    </span>
                  </button>
                );
              })}
          </div>
        </div>

        <div className="rounded-xl border border-line bg-ink/[0.018]">
          <button
            type="button"
            onClick={() => setScheduleOpen((value) => !value)}
            aria-expanded={scheduleOpen}
            className="flex h-12 w-full items-center gap-2.5 px-3.5 text-left"
          >
            <Icon
              name="calendar"
              size={16}
              className={dateStr ? 'text-violet' : 'text-ink-3'}
            />
            <span className="min-w-0 flex-1">
              <span className="block text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-3">
                Schedule
              </span>
              <span className="mt-0.5 block truncate text-[12px] font-medium text-ink-2">
                {scheduleSummary(dateStr, timeStr)}
              </span>
            </span>
            <motion.span
              animate={{ rotate: scheduleOpen ? 180 : 0 }}
              transition={SPRING}
              className="text-ink-3"
            >
              <Icon name="chevronDown" size={15} />
            </motion.span>
          </button>

          <AnimatePresence initial={false}>
            {scheduleOpen ? (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={SPRING}
                className="overflow-hidden"
              >
                <div className="border-t border-line px-3.5 pb-3.5 pt-3">
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { label: 'Today', days: 0 },
                      { label: 'Tomorrow', days: 1 },
                      { label: 'Next week', days: 7 },
                    ].map((option) => (
                      <button
                        key={option.label}
                        type="button"
                        onClick={() => applyQuickDate(option.days)}
                        className="h-8 rounded-full border border-line bg-ink/[0.025] px-3 text-[11px] font-medium text-ink-2 transition-colors hover:border-line-strong hover:text-ink"
                      >
                        {option.label}
                      </button>
                    ))}
                    {dateStr ? (
                      <button
                        type="button"
                        onClick={clearSchedule}
                        className="h-8 rounded-full px-3 text-[11px] font-medium text-ink-3 transition-colors hover:bg-ink/[0.04] hover:text-ink"
                      >
                        Clear
                      </button>
                    ) : null}
                  </div>

                  <div className="mt-2.5 grid grid-cols-2 gap-2">
                    <div>
                      <label
                        htmlFor={`${formId}-date`}
                        className="mb-1.5 block text-[10px] text-ink-3"
                      >
                        Date
                      </label>
                      <input
                        id={`${formId}-date`}
                        type="date"
                        value={dateStr}
                        onChange={(event) => {
                          const value = event.target.value;
                          setDateStr(value);
                          if (value && !timeStr) setTimeStr(defaultDueTime(value));
                        }}
                        className="h-10 w-full rounded-lg border border-line bg-ink/[0.03] px-2.5 text-[12px] text-ink outline-none focus:border-violet/40"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor={`${formId}-time`}
                        className="mb-1.5 block text-[10px] text-ink-3"
                      >
                        Time
                      </label>
                      <input
                        id={`${formId}-time`}
                        type="time"
                        value={timeStr}
                        onChange={(event) => setTimeStr(event.target.value)}
                        disabled={!dateStr}
                        className="h-10 w-full rounded-lg border border-line bg-ink/[0.03] px-2.5 text-[12px] text-ink outline-none focus:border-violet/40 disabled:opacity-40"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </form>
    </Sheet>
  );
}
