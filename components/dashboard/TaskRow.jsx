'use client';

import { AnimatePresence, motion, useMotionValue, useTransform } from 'framer-motion';
import Icon from '@/components/Icon';
import { dueLabel } from '@/lib/dates';
import { useIsMobile } from '@/lib/useMediaQuery';
import { CATEGORY_COLORS, PRIORITY_COLOR, PRIORITY_LABEL } from '@/lib/theme';

const SPRING = { type: 'spring', bounce: 0, duration: 0.34 };

export default function TaskRow({ task, category, now, onToggle, onEdit, onDelete }) {
  const isMobile = useIsMobile();
  const x = useMotionValue(0);
  const doneOpacity = useTransform(x, [0, 64], [0, 1]);
  const deleteOpacity = useTransform(x, [-64, 0], [1, 0]);

  const overdue =
    !task.completed &&
    task.dueAt &&
    new Date(task.dueAt).getTime() < now.getTime();
  const categoryHex = category ? CATEGORY_COLORS[category.color] : 'rgb(var(--ink-3))';

  function handleDragEnd(_, info) {
    if (info.offset.x > 84 || info.velocity.x > 620) {
      onToggle(task, !task.completed);
      return;
    }
    if (info.offset.x < -84 || info.velocity.x < -620) {
      onDelete(task);
    }
  }

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.985, transition: { duration: 0.16 } }}
      transition={SPRING}
      className="relative list-none overflow-hidden rounded-2xl"
    >
      <div className="absolute inset-0 flex" aria-hidden="true">
        <div className="flex w-1/2 items-center bg-mint/[0.08] pl-5">
          <motion.span style={{ opacity: doneOpacity }} className="text-mint">
            <Icon name="check" size={20} strokeWidth={2.2} />
          </motion.span>
        </div>
        <div className="flex w-1/2 items-center justify-end bg-rose/[0.08] pr-5">
          <motion.span style={{ opacity: deleteOpacity }} className="text-rose">
            <Icon name="trash" size={19} />
          </motion.span>
        </div>
      </div>

      <motion.article
        drag={isMobile ? 'x' : false}
        dragDirectionLock
        dragConstraints={{ left: -112, right: 112 }}
        dragElastic={0.1}
        dragMomentum={false}
        dragSnapToOrigin
        onDragEnd={handleDragEnd}
        style={{ x }}
        className={`group relative flex gap-2.5 rounded-2xl border p-3 transition-colors sm:gap-3 ${
          task.completed
            ? 'border-line/60 bg-card'
            : overdue
              ? 'border-rose/25 bg-card hover:border-rose/40'
              : 'border-line bg-card hover:border-line-strong'
        }`}
      >
        <button
          type="button"
          onClick={() => onToggle(task, !task.completed)}
          aria-label={task.completed ? `Reopen ${task.title}` : `Complete ${task.title}`}
          aria-pressed={task.completed}
          className="-m-1.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
        >
          <motion.span
            animate={{
              backgroundColor: task.completed ? 'rgb(var(--accent))' : 'rgb(var(--ink) / 0)',
              borderColor: task.completed ? 'rgb(var(--accent))' : 'rgb(var(--ink) / 0.24)',
            }}
            transition={{ duration: 0.18 }}
            whileTap={{ scale: 0.9 }}
            className="grid h-[21px] w-[21px] place-items-center rounded-full border-[1.5px]"
          >
            <AnimatePresence initial={false}>
              {task.completed ? (
                <motion.svg
                  key="check"
                  width="13"
                  height="13"
                  viewBox="0 0 16 16"
                  fill="none"
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.6 }}
                  transition={{ duration: 0.18 }}
                >
                  <motion.path
                    d="M3.2 8.3l3.1 3.1 6.5-7"
                    stroke="rgb(var(--on-accent))"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                  />
                </motion.svg>
              ) : null}
            </AnimatePresence>
          </motion.span>
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-2">
            <button
              type="button"
              onClick={() => onEdit(task)}
              className="min-w-0 flex-1 rounded-md text-left"
              aria-label={`Edit ${task.title}`}
            >
              <span
                className={`block text-[14.5px] font-medium leading-[1.35] tracking-[-0.012em] ${
                  task.completed ? 'text-ink-3 line-through' : 'text-ink'
                }`}
              >
                {task.title}
              </span>

              {task.notes ? (
                <span
                  className={`mt-1 line-clamp-1 block text-[12px] leading-4 ${
                    task.completed ? 'text-ink-3/70' : 'text-ink-3'
                  }`}
                >
                  {task.notes}
                </span>
              ) : null}
            </button>

            <div className="hidden shrink-0 items-center gap-0.5 opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100 md:flex">
              <button
                type="button"
                onClick={() => onEdit(task)}
                aria-label={`Edit ${task.title}`}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-3 transition-colors hover:bg-ink/[0.06] hover:text-ink"
              >
                <Icon name="pencil" size={14} />
              </button>
              <button
                type="button"
                onClick={() => onDelete(task)}
                aria-label={`Delete ${task.title}`}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-3 transition-colors hover:bg-rose/10 hover:text-rose"
              >
                <Icon name="trash" size={14} />
              </button>
            </div>
          </div>

          <div className="mt-1.5 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[10.5px] leading-4">
            <span className="flex items-center gap-1.5 text-ink-3">
              <span
                className="h-[5px] w-[5px] rounded-full"
                style={{ backgroundColor: categoryHex }}
                aria-hidden="true"
              />
              {category?.name || 'Uncategorized'}
            </span>

            {task.dueAt ? (
              <span
                className={`flex items-center gap-1 ${
                  overdue ? 'font-medium text-rose' : task.completed ? 'text-ink-3/70' : 'text-ink-3'
                }`}
              >
                <Icon name="clock" size={11} />
                {dueLabel(task.dueAt, now, { done: task.completed })}
              </span>
            ) : null}

            <span
              className={`flex items-center gap-1 ${
                task.completed ? 'text-ink-3/60' : 'text-ink-3'
              }`}
            >
              <span
                className="h-[5px] w-[5px] rounded-full"
                style={{ backgroundColor: PRIORITY_COLOR[task.priority] }}
                aria-hidden="true"
              />
              {PRIORITY_LABEL[task.priority]}
            </span>
          </div>
        </div>
      </motion.article>

      <p className="sr-only">Swipe right to complete. Swipe left to delete.</p>
    </motion.li>
  );
}
