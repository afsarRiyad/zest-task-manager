'use client';

import { useEffect, useId, useState } from 'react';
import Sheet from '@/components/ui/Sheet';
import Icon from '@/components/Icon';
import { CATEGORY_COLORS, CATEGORY_NAME_MAX } from '@/lib/theme';

export default function NewCategorySheet({
  open,
  categories,
  onClose,
  onCreate,
}) {
  const formId = useId();
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('sparkles');
  const [color, setColor] = useState('violet');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) return;
    setName('');
    setIcon('sparkles');
    setColor('violet');
    setError('');
  }, [open]);

  function handleSubmit(event) {
    event.preventDefault();
    const clean = name.trim();

    if (!clean) {
      setError('Give this category a name.');
      return;
    }

    if (categories.some((category) => category.name.toLowerCase() === clean.toLowerCase())) {
      setError('You already have a category with that name.');
      return;
    }

    onCreate({ name: clean, icon, color });
  }

  const footer = (
    <div className="flex items-center justify-end gap-2">
      <button type="button" onClick={onClose} className="btn-ghost h-11 px-3.5 text-[12.5px]">
        Cancel
      </button>
      <button
        type="submit"
        form={formId}
        disabled={!name.trim()}
        className="btn-primary h-11 min-w-[132px] text-[13px] disabled:cursor-not-allowed disabled:opacity-40"
      >
        Create category
      </button>
    </div>
  );

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title="New category"
      eyebrow="Make it yours"
      description="Group the parts of your life without adding noise."
      footer={footer}
    >
      <form id={formId} onSubmit={handleSubmit} className="space-y-6 pb-3">
        <div className="rounded-2xl border border-line bg-ink/[0.018] p-4">
          <p className="label-caps">Preview</p>
          <div className="mt-3 flex items-center gap-2">
            <span
              className="inline-flex h-9 items-center gap-2 rounded-full border px-3 text-[12px] font-medium"
              style={{
                borderColor: `${CATEGORY_COLORS[color]}40`,
                backgroundColor: `${CATEGORY_COLORS[color]}14`,
                color: 'rgb(var(--ink))',
              }}
            >
              <Icon name={icon} size={14} style={{ color: CATEGORY_COLORS[color] }} />
              {name.trim() || 'New category'}
            </span>
            <span className="text-[11px] text-ink-3">appears in your category menu</span>
          </div>
        </div>

        <div>
          <label htmlFor={`${formId}-name`} className="label-caps">
            Name
          </label>
          <input
            id={`${formId}-name`}
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              if (error) setError('');
            }}
            maxLength={CATEGORY_NAME_MAX}
            placeholder="Errands, studio, side quest…"
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${formId}-error` : undefined}
            className={`field mt-2 ${error ? 'border-rose/50 focus:border-rose/60' : ''}`}
          />
          {error ? (
            <p id={`${formId}-error`} role="alert" className="mt-1.5 text-[11.5px] font-medium text-rose">
              {error}
            </p>
          ) : null}
        </div>

        <div>
          <p className="label-caps">Icon</p>
          <div className="mt-2 grid grid-cols-8 gap-1.5">
            {[
              'sparkles',
              'briefcase',
              'book',
              'heart',
              'home',
              'bolt',
              'moon',
              'target',
            ].map((option) => {
              const active = icon === option;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => setIcon(option)}
                  aria-label={`Use the ${option} icon`}
                  aria-pressed={active}
                  className={`grid aspect-square place-items-center rounded-xl border transition-colors ${
                    active
                      ? 'border-violet/30 bg-violet/10 text-violet'
                      : 'border-line bg-ink/[0.02] text-ink-3 hover:border-line-strong hover:text-ink'
                  }`}
                >
                  <Icon name={option} size={17} />
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <p className="label-caps">Color</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {Object.entries(CATEGORY_COLORS).map(([key, hex]) => {
              const active = color === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setColor(key)}
                  aria-label={`Use ${key}`}
                  aria-pressed={active}
                  className={`grid h-10 w-10 place-items-center rounded-full border-2 transition-colors ${
                    active ? 'border-ink/70' : 'border-transparent hover:border-ink/20'
                  }`}
                >
                  <span
                    className="grid h-7 w-7 place-items-center rounded-full text-[#1A1410]"
                    style={{ backgroundColor: hex }}
                  >
                    {active ? <Icon name="check" size={14} strokeWidth={2.6} /> : null}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </form>
    </Sheet>
  );
}
