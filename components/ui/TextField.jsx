'use client';

import { useId } from 'react';
import Icon from '@/components/Icon';

export default function TextField({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  autoComplete,
  error,
  hint,
  icon,
  autoFocus = false,
  name,
  inputMode,
  maxLength,
}) {
  const id = useId();
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <label htmlFor={id} className="text-[12px] font-medium text-ink-2">
          {label}
        </label>
        {hint ? (
          <span id={hintId} className="text-[10.5px] text-ink-3">
            {hint}
          </span>
        ) : null}
      </div>

      <div className="relative mt-2">
        {icon ? (
          <Icon
            name={icon}
            size={16}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-3"
          />
        ) : null}

        <input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          autoFocus={autoFocus}
          inputMode={inputMode}
          maxLength={maxLength}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : hint ? hintId : undefined}
          className={`field ${icon ? 'pl-10' : ''} ${
            error ? 'border-rose/50 focus:border-rose/60 focus:ring-rose/10' : ''
          }`}
        />
      </div>

      {error ? (
        <p id={errorId} role="alert" className="mt-1.5 text-[11.5px] font-medium text-rose">
          {error}
        </p>
      ) : null}
    </div>
  );
}
