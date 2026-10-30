'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import Logo from '@/components/Logo';
import Icon from '@/components/Icon';
import AnimeCompanion from '@/features/mascot/AnimeCompanion';
import { useTheme } from '@/components/ThemeProvider';

const SPRING = { type: 'spring', bounce: 0, duration: 0.5 };

export default function AuthLayout({ eyebrow, title, subtitle, children }) {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <div className="relative min-h-dvh">
      <div className="mx-auto grid min-h-dvh w-full max-w-[1380px] lg:grid-cols-[minmax(0,1fr)_minmax(0,0.94fr)] lg:gap-10 lg:px-8">
        <main className="flex min-h-dvh flex-col px-5 py-6 sm:px-8 lg:min-h-dvh lg:py-8">
          <div className="flex items-center justify-between">
            <Logo />
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
                aria-label={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
                className="icon-btn h-9 w-9"
              >
                <Icon name={resolvedTheme === 'dark' ? 'sun' : 'moon'} size={16} />
              </button>
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-[11.5px] font-medium text-ink-3 transition-colors hover:text-ink"
              >
                <Icon name="arrowLeft" size={13} />
                Back home
              </Link>
            </div>
          </div>

          <div className="flex flex-1 items-center justify-center py-8 sm:py-10 lg:justify-start">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={SPRING}
              className="mx-auto w-full max-w-[420px] lg:mx-0"
            >
              <p className="label-caps">{eyebrow}</p>
              <h1 className="mt-3 font-display text-[33px] font-semibold leading-[1.08] tracking-[-0.045em] text-ink sm:text-[38px]">
                {title}
              </h1>
              <p className="mt-2.5 max-w-[40ch] text-[13px] leading-5 text-ink-2">{subtitle}</p>

              <div className="mt-7">{children}</div>
            </motion.div>
          </div>

          <footer className="border-t border-line pt-4 text-[10px] leading-4 text-ink-3">
            <span>© 2026 Zest</span>
          </footer>
        </main>

        <aside className="hidden items-center justify-center py-8 lg:flex">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ ...SPRING, delay: 0.08 }}
            className="relative flex h-full max-h-[calc(100dvh-4rem)] min-h-[620px] w-full max-w-[520px] flex-col overflow-hidden rounded-[32px] border border-line bg-gradient-to-b from-elevated via-card to-card"
          >
            <div
              className="pointer-events-none absolute -inset-x-16 -top-28 h-[420px] bg-[radial-gradient(closest-side,rgb(var(--accent)/0.18),transparent)]"
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.05]"
              style={{
                backgroundImage:
                  'linear-gradient(rgb(var(--ink) / 0.4) 1px, transparent 1px), linear-gradient(90deg, rgb(var(--ink) / 0.4) 1px, transparent 1px)',
                backgroundSize: '30px 30px',
                maskImage: 'radial-gradient(circle at 50% 35%, #000, transparent 72%)',
                WebkitMaskImage: 'radial-gradient(circle at 50% 35%, #000, transparent 72%)',
              }}
              aria-hidden="true"
            />

            <div className="relative flex items-center justify-between px-6 pt-6">
              <p className="label-caps">Inside Zest</p>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-ink/[0.03] px-2.5 py-1 text-[10px] font-medium text-ink-2">
                <span className="h-1.5 w-1.5 rounded-full bg-mint" aria-hidden="true" />
                Nova is here
              </span>
            </div>

            <div className="relative flex flex-1 items-end justify-center overflow-hidden">
              <AnimeCompanion
                mood="happy"
                variant="portrait"
                className="h-[400px] w-auto max-w-full"
                interactive={false}
              />
              <div
                className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-card to-transparent"
                aria-hidden="true"
              />
            </div>

            <div className="relative px-6 pb-6">
              <p className="font-editorial text-[31px] font-medium italic leading-[1.06] tracking-[-0.03em] text-ink">
                “Make the next hour <span className="text-accent">feel lighter.</span>”
              </p>
              <p className="mt-3 max-w-[38ch] text-[12px] leading-5 text-ink-2">
                Nova reads the room, keeps the plan honest, and never makes a mess of your day.
              </p>

              <div className="mt-5 flex flex-wrap gap-1.5">
                {['Focus companion', 'No streak guilt', 'Light by design'].map((chip) => (
                  <span
                    key={chip}
                    className="rounded-full border border-line bg-ink/[0.025] px-2.5 py-1 text-[10px] font-medium text-ink-2"
                  >
                    {chip}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </aside>
      </div>
    </div>
  );
}
