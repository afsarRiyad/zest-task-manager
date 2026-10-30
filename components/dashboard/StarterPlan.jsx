'use client';

import { motion } from 'framer-motion';
import Icon from '@/components/Icon';
import { CATEGORY_COLORS } from '@/lib/theme';

const STARTERS = [
  {
    id: 'tomorrow',
    title: "Write tomorrow's top three",
    meta: 'A five-minute reset',
    icon: 'pencil',
    category: 'personal',
    priority: 'medium',
  },
  {
    id: 'desk',
    title: 'Clear one thing off your desk',
    meta: 'One small physical win',
    icon: 'briefcase',
    category: 'work',
    priority: 'medium',
  },
  {
    id: 'walk',
    title: 'Step outside for ten minutes',
    meta: 'No phone, no list',
    icon: 'sun',
    category: 'health',
    priority: 'low',
  },
];

export default function StarterPlan({ categories, onPick }) {
  function handlePick(starter) {
    const match =
      categories.find(
        (category) => category.name.toLowerCase() === starter.category
      ) || categories[0];

    onPick({
      title: starter.title,
      notes: '',
      categoryId: match?.id || null,
      priority: starter.priority,
      dueAt: null,
    });
  }

  return (
    <section className="mt-10" aria-labelledby="starter-title">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="label-caps">A little momentum</p>
          <h2
            id="starter-title"
            className="mt-1 font-display text-[17px] font-semibold tracking-[-0.03em] text-ink"
          >
            Three ways to start
          </h2>
        </div>
        <p className="hidden max-w-[30ch] pb-0.5 text-right text-[11px] leading-4 text-ink-3 sm:block">
          Pick one. It lands on today&apos;s list with no due date.
        </p>
      </div>

      <div className="mt-4 grid gap-2.5 sm:grid-cols-3">
        {STARTERS.map((starter) => {
          const category = categories.find(
            (item) => item.name.toLowerCase() === starter.category
          );

          return (
            <motion.button
              key={starter.id}
              type="button"
              onClick={() => handlePick(starter)}
              whileTap={{ scale: 0.985 }}
              className="group flex h-full flex-col items-start rounded-2xl border border-line bg-ink/[0.018] p-3.5 text-left transition-colors hover:border-line-strong hover:bg-ink/[0.035]"
            >
              <span className="flex w-full items-start justify-between">
                <span className="grid h-8 w-8 place-items-center rounded-lg border border-ink/[0.06] bg-ink/[0.035] text-ink-2 transition-colors group-hover:text-violet">
                  <Icon name={starter.icon} size={15} strokeWidth={1.8} />
                </span>
                <span className="grid h-7 w-7 place-items-center rounded-full border border-line text-ink-3 transition-colors group-hover:border-violet/30 group-hover:text-violet">
                  <Icon name="plus" size={13} strokeWidth={2} />
                </span>
              </span>

              <span className="mt-3 text-[12.5px] font-semibold leading-[1.35] text-ink">
                {starter.title}
              </span>
              <span className="mt-1 text-[10.5px] text-ink-3">{starter.meta}</span>

              {category ? (
                <span className="mt-3 inline-flex items-center gap-1.5 text-[10px] text-ink-3">
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: CATEGORY_COLORS[category.color] }}
                    aria-hidden="true"
                  />
                  {category.name}
                </span>
              ) : null}
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}
