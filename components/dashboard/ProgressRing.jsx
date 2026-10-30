'use client';

import { useId } from 'react';
import { motion } from 'framer-motion';

export default function ProgressRing({
  value = 0,
  size = 96,
  stroke = 7,
  children,
  className = '',
}) {
  const uid = useId().replace(/:/g, '');
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, Number(value) || 0));
  const offset = circumference * (1 - clamped / 100);

  return (
    <div
      className={`relative inline-grid shrink-0 place-items-center ${className}`}
      style={{ width: size, height: size }}
      role="img"
      aria-label={`${Math.round(clamped)} percent complete`}
    >
      <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
        <defs>
          <linearGradient id={`${uid}-ring`} x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="rgb(var(--accent))" />
            <stop offset="0.55" stopColor="rgb(var(--accent-deep))" />
            <stop offset="1" stopColor="rgb(var(--lavender))" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgb(var(--ink) / 0.1)"
          strokeWidth={stroke}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#${uid}-ring)`}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={false}
          animate={{ strokeDashoffset: offset }}
          transition={{ type: 'spring', bounce: 0, duration: 0.9 }}
        />
      </svg>

      <div className="absolute inset-0 grid place-items-center">{children}</div>
    </div>
  );
}
