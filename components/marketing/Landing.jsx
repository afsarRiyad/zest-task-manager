'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import Logo from '@/components/Logo';
import Icon from '@/components/Icon';
import ProductPreview from '@/components/marketing/ProductPreview';
import AnimeCompanion from '@/features/mascot/AnimeCompanion';
import { useTheme } from '@/components/ThemeProvider';
import { getCurrentUser } from '@/lib/auth';

const MOODS = [
  {
    id: 'idle',
    label: 'Calm',
    color: 'rgb(var(--accent))',
    message: 'No rush. Pick the next honest thing.',
  },
  {
    id: 'happy',
    label: 'Happy',
    color: 'rgb(var(--lavender))',
    message: 'There you are. Let’s make today feel lighter.',
  },
  {
    id: 'cheer',
    label: 'Cheering',
    color: 'rgb(var(--mint))',
    message: 'Everything’s clear. That’s the whole list.',
  },
  {
    id: 'concerned',
    label: 'Concerned',
    color: 'rgb(var(--amber))',
    message: 'One thing slipped. We can put it back on the map.',
  },
  {
    id: 'sleepy',
    label: 'Winding down',
    color: 'rgb(var(--ink-3))',
    message: 'It’s late. The list will still be here tomorrow.',
  },
];

const reveal = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-70px' },
  transition: { type: 'spring', bounce: 0, duration: 0.66 },
};

export default function Landing() {
  const [user, setUser] = useState(null);
  const [mood, setMood] = useState('happy');
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    setUser(getCurrentUser());
  }, []);

  const activeMood = MOODS.find((item) => item.id === mood) || MOODS[1];
  const primaryHref = user ? '/dashboard' : '/signup';
  const primaryLabel = user ? 'Open Zest' : 'Start free';

  return (
    <div className="relative min-h-dvh overflow-hidden">
      <header className="sticky top-0 z-50 border-b border-line/70 bg-canvas/70 backdrop-blur-2xl">
        <div className="mx-auto flex h-16 w-full max-w-[1280px] items-center justify-between gap-4 px-5 sm:px-8">
          <Logo />

          <nav className="hidden items-center gap-7 md:flex" aria-label="Primary">
            <a href="#features" className="text-[12px] font-medium text-ink-2 transition-colors hover:text-ink">
              Product
            </a>
            <a href="#nova" className="text-[12px] font-medium text-ink-2 transition-colors hover:text-ink">
              Companion
            </a>
            <a href="#principles" className="text-[12px] font-medium text-ink-2 transition-colors hover:text-ink">
              Principles
            </a>
          </nav>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
              aria-label={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
              className="icon-btn h-9 w-9"
            >
              <Icon name={resolvedTheme === 'dark' ? 'sun' : 'moon'} size={16} />
            </button>
            <Link
              href={user ? '/dashboard' : '/login'}
              className="hidden h-9 items-center rounded-full px-3.5 text-[11.5px] font-medium text-ink-2 transition-colors hover:bg-ink/[0.05] hover:text-ink sm:inline-flex"
            >
              {user ? 'Dashboard' : 'Log in'}
            </Link>
            <Link
              href={primaryHref}
              className="inline-flex h-9 items-center gap-1.5 rounded-full bg-accent px-4 text-[11.5px] font-semibold text-on-accent shadow-soft transition-colors hover:bg-accent-deep"
            >
              {primaryLabel}
              <Icon name="arrowUpRight" size={13} strokeWidth={2} />
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="mx-auto grid w-full max-w-[1280px] items-center gap-12 px-5 pb-16 pt-14 sm:px-8 sm:pt-20 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-14 lg:pb-24 lg:pt-24">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', bounce: 0, duration: 0.7 }}
          >
            <span className="inline-flex h-7 items-center gap-2 rounded-full border border-line bg-ink/[0.035] px-3 text-[10.5px] font-medium text-ink-2">
              <span
                className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_12px_rgb(var(--accent)/0.55)]"
                aria-hidden="true"
              />
              A calmer productivity system
            </span>

            <h1 className="mt-6 font-display text-[46px] font-semibold leading-[0.94] tracking-[-0.055em] text-ink sm:text-[64px] xl:text-[76px]">
              Make room for
              <span className="mt-1 block font-editorial font-semibold italic tracking-[-0.045em] text-accent">
                momentum.
              </span>
            </h1>

            <p className="mt-6 max-w-[47ch] text-[14.5px] leading-6 text-ink-2 sm:text-[15.5px] sm:leading-7">
              Zest is a task manager with a focus companion who reads the room, keeps the
              plan light, and makes finishing feel good.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-2.5">
              <Link href={primaryHref} className="btn-primary h-12 px-6 text-[13px]">
                {primaryLabel}
                <Icon name="arrowRight" size={16} />
              </Link>
              <a href="#features" className="btn-secondary h-12 px-5 text-[13px]">
                See inside
                <Icon name="chevronDown" size={15} />
              </a>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-[10.5px] text-ink-3">
              {['No credit card', 'No streak guilt', 'A minute to your first list'].map((item) => (
                <span key={item} className="inline-flex items-center gap-1.5">
                  <Icon name="check" size={12} className="text-mint" />
                  {item}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.975, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: 'spring', bounce: 0, duration: 0.8, delay: 0.1 }}
            className="relative"
          >
            <ProductPreview />
          </motion.div>
        </section>

        <section id="features" className="border-t border-line">
          <div className="mx-auto w-full max-w-[1280px] px-5 py-16 sm:px-8 lg:py-24">
            <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="label-caps">The system</p>
                <h2 className="mt-3 max-w-[15ch] font-display text-[34px] font-semibold leading-[1.02] tracking-[-0.05em] text-ink sm:text-[44px]">
                  Less managing. More{' '}
                  <span className="font-editorial font-semibold italic text-accent">finishing.</span>
                </h2>
              </div>
              <p className="max-w-[40ch] text-[13px] leading-6 text-ink-2">
                Every control is here because it changes what you do next. Everything else was
                left out on purpose.
              </p>
            </div>

            <div className="mt-10 grid gap-3 md:grid-cols-12">
              <FeatureCard
                className="md:col-span-7"
                kicker="Filter"
                title="Categories that unfold."
                body="One quiet control instead of a permanent row of chips. Open it, pick a corner, and get back to the work."
              >
                <CategoryMock />
              </FeatureCard>

              <FeatureCard
                className="md:col-span-5"
                kicker="Reflection"
                title="The week, honestly."
                body="A small chart of real completions. No invented productivity score, no streak to protect."
                tone
              >
                <WeekMock />
              </FeatureCard>

              <FeatureCard
                className="md:col-span-5"
                kicker="Details"
                title="At the edge, not in your face."
                body="Notes, priority and a due date slide in from the side. The list stays the main character."
              >
                <SheetMock />
              </FeatureCard>

              <FeatureCard
                className="md:col-span-7"
                kicker="A quieter metric"
                title="No streak guilt."
                body="Your worth is not a number that resets at midnight. Zest shows real momentum and leaves the judgment out."
                tone
              >
                <div className="flex flex-col justify-between gap-6 sm:min-h-[196px]">
                  <div>
                    <p className="max-w-[30ch] font-editorial text-[28px] font-medium italic leading-[1.12] tracking-[-0.02em] text-ink">
                      “A tool should lower the temperature, not raise it.”
                    </p>
                    <p className="mt-4 max-w-[42ch] text-[12.5px] leading-5 text-ink-2">
                      Momentum is allowed to look uneven. A quiet day still counts.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {['No fake urgency', 'No confetti tax', 'No red badge spiral'].map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-line bg-ink/[0.025] px-2.5 py-1 text-[9.5px] font-medium text-ink-2"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </FeatureCard>
            </div>
          </div>
        </section>

        <section id="nova" className="border-t border-line">
          <div className="mx-auto grid w-full max-w-[1280px] items-center gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:gap-16 lg:py-24">
            <motion.div {...reveal} className="order-2 lg:order-1">
              <div className="relative overflow-hidden rounded-[30px] border border-line bg-gradient-to-b from-elevated via-card to-card">
                <div
                  className="pointer-events-none absolute -inset-x-20 -top-32 h-[440px] bg-[radial-gradient(closest-side,rgb(var(--accent)/0.16),transparent)]"
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

                <div className="relative flex items-start justify-between px-6 pt-6">
                  <div>
                    <p className="label-caps">Focus companion</p>
                    <p className="mt-1 font-display text-[19px] font-semibold tracking-[-0.03em] text-ink">
                      Nova
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-ink/[0.035] px-2.5 py-1 text-[10px] font-medium text-ink-2">
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ backgroundColor: activeMood.color }}
                    />
                    {activeMood.label}
                  </span>
                </div>

                <div className="relative flex h-[360px] items-end justify-center overflow-hidden sm:h-[420px]">
                  <AnimeCompanion
                    mood={mood}
                    variant="portrait"
                    className="h-full w-auto max-w-full"
                    interactive={false}
                  />
                  <div
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-card to-transparent"
                    aria-hidden="true"
                  />
                </div>

                <div className="relative -mt-8 px-5 pb-5" aria-live="polite">
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={mood}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.2 }}
                      className="rounded-2xl border border-ink/[0.07] bg-surface/85 px-3.5 py-3 text-[12.5px] leading-5 text-ink-2 shadow-panel backdrop-blur-md"
                    >
                      {activeMood.message}
                    </motion.p>
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>

            <motion.div {...reveal} className="order-1 lg:order-2">
              <p className="label-caps">Meet Nova</p>
              <h2 className="mt-3 max-w-[15ch] font-display text-[34px] font-semibold leading-[1.02] tracking-[-0.05em] text-ink sm:text-[44px]">
                A companion who reads the room.
              </h2>
              <p className="mt-5 max-w-[44ch] text-[13.5px] leading-6 text-ink-2">
                She reacts to your list, not your notifications. A small hello when you arrive, a
                quiet nod when something gets done, and a concerned look when a deadline slips.
              </p>

              <div className="mt-7">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-ink-3">
                    Try a mood
                  </p>
                  <span className="text-[10px] text-ink-3">Tap to change her expression</span>
                </div>
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {MOODS.map((item) => {
                    const active = mood === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setMood(item.id)}
                        aria-pressed={active}
                        className={`inline-flex h-9 items-center gap-2 rounded-full border px-3 text-[11px] font-medium transition-colors ${
                          active
                            ? 'border-violet/35 bg-violet/10 text-ink'
                            : 'border-line bg-ink/[0.02] text-ink-2 hover:border-line-strong hover:text-ink'
                        }`}
                      >
                        <span
                          className="h-1.5 w-1.5 rounded-full"
                          style={{ backgroundColor: item.color }}
                          aria-hidden="true"
                        />
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-8 space-y-2.5 border-t border-line pt-5">
                {[
                  'Greets you once, then gets out of the way.',
                  'Reacts to real task states, not a scripted loop.',
                  'An original character, drawn for Zest.',
                ].map((item) => (
                  <p key={item} className="flex items-start gap-2 text-[11.5px] leading-5 text-ink-2">
                    <Icon name="check" size={13} className="mt-1 shrink-0 text-mint" />
                    {item}
                  </p>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        <section id="principles" className="border-t border-line">
          <div className="mx-auto w-full max-w-[1280px] px-5 py-16 sm:px-8 lg:py-24">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] lg:gap-16">
              <div>
                <p className="label-caps">The Zest rules</p>
                <h2 className="mt-3 max-w-[10ch] font-display text-[34px] font-semibold leading-[1.02] tracking-[-0.05em] text-ink sm:text-[42px]">
                  What we left <span className="font-editorial font-normal italic text-violet">out.</span>
                </h2>
                <p className="mt-4 max-w-[34ch] text-[12.5px] leading-6 text-ink-2">
                  Restraint is a feature. These are the boundaries the product is built around.
                </p>
              </div>

              <div>
                {[
                  {
                    number: '01',
                    title: 'Quiet over loud.',
                    body: 'If it does not help you decide what to do next, it does not belong on the screen.',
                  },
                  {
                    number: '02',
                    title: 'Momentum over metrics.',
                    body: 'No streak to protect. No guilt loop. Just a clear next step and the space to take it.',
                  },
                  {
                    number: '03',
                    title: 'Your attention, not our growth.',
                    body: 'No autoplay, no notification bait, no fake urgency. The app waits for you.',
                  },
                ].map((rule) => (
                  <motion.div
                    key={rule.number}
                    {...reveal}
                    className="grid gap-2 border-t border-line py-6 sm:grid-cols-[52px_1fr_1.25fr] sm:gap-6"
                  >
                    <span className="font-editorial text-[20px] italic text-ink-3">{rule.number}</span>
                    <h3 className="font-display text-[17px] font-semibold tracking-[-0.025em] text-ink">
                      {rule.title}
                    </h3>
                    <p className="max-w-[44ch] text-[12.5px] leading-5 text-ink-2">{rule.body}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-[1280px] px-5 pb-16 sm:px-8 lg:pb-24">
          <motion.div
            {...reveal}
            className="relative overflow-hidden rounded-[32px] border border-line bg-gradient-to-br from-accent-soft/70 via-card to-lavender-soft/60 px-6 py-10 sm:px-10 lg:px-12 lg:py-12"
          >
            <div
              className="pointer-events-none absolute -right-20 -top-32 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgb(var(--accent)/0.2),transparent_68%)]"
              aria-hidden="true"
            />
            <div className="relative grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
              <div>
                <p className="label-caps">Ready when you are</p>
                <h2 className="mt-3 max-w-[15ch] font-display text-[34px] font-semibold leading-[1.02] tracking-[-0.05em] text-ink sm:text-[46px]">
                  Make the next hour{' '}
                  <span className="font-editorial font-normal italic text-violet">lighter.</span>
                </h2>
                <p className="mt-4 max-w-[42ch] text-[13px] leading-6 text-ink-2">
                  Bring the list. Nova will bring the calm. Your first clear page is about a
                  minute away.
                </p>
                <div className="mt-6 flex flex-wrap items-center gap-2.5">
                  <Link href={primaryHref} className="btn-primary h-11 px-5 text-[12.5px]">
                    {primaryLabel}
                    <Icon name="arrowRight" size={15} />
                  </Link>
                  {!user ? (
                    <Link
                      href="/login"
                      className="inline-flex h-11 items-center px-3 text-[12px] font-medium text-ink-2 transition-colors hover:text-ink"
                    >
                      I already have an account
                    </Link>
                  ) : null}
                </div>
              </div>

              <div className="relative hidden h-[280px] items-end justify-center lg:flex">
                <AnimeCompanion
                  mood="cheer"
                  variant="portrait"
                  className="h-[280px] w-auto"
                  interactive={false}
                  style={{
                    maskImage: 'linear-gradient(to bottom, #000 76%, transparent 99%)',
                    WebkitMaskImage: 'linear-gradient(to bottom, #000 76%, transparent 99%)',
                  }}
                />
              </div>
            </div>
          </motion.div>
        </section>
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto w-full max-w-[1280px] px-5 py-10 sm:px-8">
          <div className="grid gap-8 sm:grid-cols-[1.4fr_1fr_1fr]">
            <div>
              <Logo />
              <p className="mt-3 max-w-[30ch] text-[11.5px] leading-5 text-ink-3">
                A calmer place to keep the list, with a companion who knows when to speak up.
              </p>
            </div>

            <div>
              <p className="label-caps">Explore</p>
              <div className="mt-3 flex flex-col items-start gap-2">
                <a href="#features" className="text-[11.5px] text-ink-2 transition-colors hover:text-ink">
                  Product
                </a>
                <a href="#nova" className="text-[11.5px] text-ink-2 transition-colors hover:text-ink">
                  Companion
                </a>
                <a href="#principles" className="text-[11.5px] text-ink-2 transition-colors hover:text-ink">
                  Principles
                </a>
              </div>
            </div>

            <div>
              <p className="label-caps">Account</p>
              <div className="mt-3 flex flex-col items-start gap-2">
                <Link
                  href={user ? '/dashboard' : '/login'}
                  className="text-[11.5px] text-ink-2 transition-colors hover:text-ink"
                >
                  {user ? 'Dashboard' : 'Log in'}
                </Link>
                {!user ? (
                  <Link
                    href="/signup"
                    className="text-[11.5px] text-ink-2 transition-colors hover:text-ink"
                  >
                    Create account
                  </Link>
                ) : null}
              </div>
            </div>
          </div>

          <div className="mt-9 flex flex-col gap-2 border-t border-line pt-5 text-[10px] leading-4 text-ink-3 sm:flex-row sm:items-center sm:justify-between">
            <span>© 2026 Zest. Made for people with better things to do.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ className = '', kicker, title, body, children, tone = false }) {
  return (
    <motion.div
      {...reveal}
      className={`relative overflow-hidden rounded-panel border border-line p-5 sm:p-6 ${
        tone
          ? 'bg-gradient-to-br from-elevated to-card'
          : 'bg-card'
      } ${className}`}
    >
      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-3">
        {kicker}
      </p>
      <h3 className="mt-2 font-display text-[20px] font-semibold tracking-[-0.035em] text-ink sm:text-[22px]">
        {title}
      </h3>
      <p className="mt-2 max-w-[48ch] text-[12.5px] leading-5 text-ink-2">{body}</p>
      {children ? <div className="mt-6">{children}</div> : null}
    </motion.div>
  );
}

function CategoryMock() {
  const rows = [
    { name: 'All categories', count: 8, color: null, active: false },
    { name: 'Personal', count: 3, color: '#D38A0F', active: false },
    { name: 'Work', count: 2, color: '#5B8DEF', active: true },
    { name: 'Study', count: 1, color: '#8970E8', active: false },
  ];

  return (
    <div className="relative h-[248px]" aria-hidden="true">
      <div className="inline-flex h-8 items-center gap-2 rounded-full border border-violet/25 bg-violet/[0.09] px-3 text-[10px] font-medium text-ink">
        <span className="h-1.5 w-1.5 rounded-full bg-cyan" />
        Work
        <Icon name="chevronDown" size={11} className="text-ink-3" />
      </div>

      <div className="absolute left-0 top-10 w-[248px] rounded-2xl border border-line bg-card p-1.5 shadow-float">
        <p className="px-2.5 pb-1.5 pt-1 text-[8px] font-semibold uppercase tracking-[0.16em] text-ink-3">
          Filter by category
        </p>
        {rows.map((row) => (
          <div
            key={row.name}
            className={`flex h-8 items-center gap-2 rounded-lg px-2.5 text-[10px] ${
              row.active
                ? 'border border-violet/15 bg-violet/[0.09] text-ink'
                : 'text-ink-2'
            }`}
          >
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: row.color || '#788294' }}
            />
            <span className="flex-1">{row.name}</span>
            <span className="text-[8px] tabular-nums text-ink-3">{row.count}</span>
            {row.active ? <Icon name="check" size={10} className="text-violet" /> : null}
          </div>
        ))}
        <div className="my-1 h-px bg-line" />
        <div className="flex h-7 items-center gap-2 px-2.5 text-[9px] text-ink-3">
          <span className="grid h-5 w-5 place-items-center rounded-md border border-dashed border-ink/15">
            <Icon name="plus" size={10} />
          </span>
          New category
        </div>
      </div>
    </div>
  );
}

function WeekMock() {
  const bars = [30, 54, 22, 72, 44, 86, 58];

  return (
    <div aria-hidden="true">
      <div className="flex h-[176px] items-end gap-2">
        {bars.map((height, index) => (
          <div key={index} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
            <motion.span
              initial={{ height: 0 }}
              whileInView={{ height: `${height}%` }}
              viewport={{ once: true }}
              transition={{ type: 'spring', bounce: 0, duration: 0.8, delay: index * 0.04 }}
              className={`w-full max-w-[22px] rounded-full ${
                index === 5
                  ? 'bg-gradient-to-t from-cyan-deep/40 to-cyan'
                  : 'bg-gradient-to-t from-violet-deep/40 to-violet/75'
              }`}
            />
            <span
              className={`text-[9px] ${index === 5 ? 'text-cyan' : 'text-ink-3'}`}
            >
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'][index]}
            </span>
          </div>
        ))}
      </div>
      <p className="mt-3 text-[10px] text-ink-3">Real finishes from your own week.</p>
    </div>
  );
}

function SheetMock() {
  return (
    <div className="relative h-[196px] overflow-hidden rounded-xl border border-line bg-canvas p-3" aria-hidden="true">
      <div className="space-y-2 opacity-45">
        {[
          ['Outline the launch note', '#5B8DEF'],
          ['Book the studio session', '#8970E8'],
          ['Send the follow-up', '#E2556F'],
        ].map(([task, color]) => (
          <div key={task} className="flex items-center gap-2 rounded-lg border border-line/60 px-2 py-2">
            <span className="h-3 w-3 rounded-full border border-ink/20" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[8.5px] text-ink-2">{task}</p>
              <p className="mt-0.5 flex items-center gap-1 text-[7px] text-ink-3">
                <span className="h-1 w-1 rounded-full" style={{ backgroundColor: color }} />
                Work · Today
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="absolute inset-y-0 right-0 w-[66%] rounded-l-2xl border-l border-line bg-card p-3 shadow-[-20px_0_40px_rgb(var(--shadow-color)/0.12)]">
        <div className="flex items-center justify-between">
          <p className="text-[7px] font-semibold uppercase tracking-[0.14em] text-ink-3">
            New task
          </p>
          <Icon name="x" size={10} className="text-ink-3" />
        </div>
        <p className="mt-2 font-display text-[12px] font-medium leading-4 text-ink">
          Outline the launch note
        </p>
        <div className="mt-2 flex gap-1">
          {[
            ['High', '#E2556F'],
            ['Work', '#5B8DEF'],
          ].map(([label, color]) => (
            <span
              key={label}
              className="inline-flex h-5 items-center gap-1 rounded-full border border-line px-1.5 text-[7px] text-ink-2"
            >
              <span className="h-1 w-1 rounded-full" style={{ backgroundColor: color }} />
              {label}
            </span>
          ))}
        </div>
        <div className="mt-2 flex h-7 items-center gap-1.5 rounded-lg border border-line bg-ink/[0.025] px-2 text-[7.5px] text-ink-2">
          <Icon name="calendar" size={9} className="text-violet" />
          Tomorrow · 5:00 PM
        </div>
        <div className="mt-2 grid h-7 place-items-center rounded-full bg-accent text-[8px] font-semibold text-on-accent">
          Save task
        </div>
      </div>
    </div>
  );
}
