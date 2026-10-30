import Link from 'next/link';
import Logo from '@/components/Logo';
import Icon from '@/components/Icon';

export const metadata = {
  title: 'Page not found',
};

export default function NotFound() {
  return (
    <main className="relative flex min-h-dvh flex-col">
      <header className="flex items-center justify-between px-5 py-6 sm:px-8">
        <Logo />
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-[11.5px] font-medium text-ink-3 transition-colors hover:text-ink"
        >
          Dashboard
          <Icon name="arrowRight" size={13} />
        </Link>
      </header>

      <div className="flex flex-1 items-center justify-center px-5 pb-16">
        <div className="w-full max-w-[460px] text-center">
          <p className="label-caps">Lost thread</p>

          <p
            className="mt-4 font-display text-[92px] font-extrabold leading-none tracking-[-0.06em] text-accent sm:text-[124px]"
            aria-hidden="true"
          >
            404
          </p>

          <h1 className="mt-5 font-display text-[26px] font-semibold leading-[1.12] tracking-[-0.035em] text-ink sm:text-[30px]">
            This page isn&apos;t on the list.
          </h1>

          <p className="mx-auto mt-3 max-w-[42ch] text-[13.5px] leading-6 text-ink-2">
            The link may be old or the page moved. Nothing is lost on your tasks — only this
            address.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/" className="btn-primary w-full sm:w-auto">
              Back home
              <Icon name="arrowRight" size={16} />
            </Link>
            <Link href="/dashboard" className="btn-secondary w-full sm:w-auto">
              Open the dashboard
            </Link>
          </div>
        </div>
      </div>

      <footer className="border-t border-line px-5 py-4 text-center text-[10px] leading-4 text-ink-3 sm:px-8">
        <span>© 2026 Zest</span>
      </footer>
    </main>
  );
}