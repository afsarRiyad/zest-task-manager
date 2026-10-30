'use client';

import { useId, useState } from 'react';
import Icon from '@/components/Icon';

export default function PasswordField({
  label = 'Password',
  value,
  onChange,
  placeholder = 'At least 8 characters',
  autoComplete = 'current-password',
  error,
  hint,
  name,
  disabled = false,
}) {
  const [visible, setVisible] = useState(false);
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
        <input
          id={id}
          name={name}
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : hint ? hintId : undefined}
          className={`field pr-12 ${
            error
              ? 'border-rose/50 focus:border-rose/60 focus:ring-rose/10'
              : ''
          }`}
        />
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          aria-label={visible ? 'Hide password' : 'Show password'}
          aria-pressed={visible}
          className="absolute right-1.5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-ink-3 transition-colors hover:bg-ink/[0.06] hover:text-ink"
        >
          <Icon name={visible ? 'eyeOff' : 'eye'} size={16} />
        </button>
      </div>

      {error ? (
        <p id={errorId} role="alert" className="mt-1.5 text-[11.5px] font-medium text-rose">
          {error}
        </p>
      ) : null}
    </div>
  );
}
