import Link from 'next/link';

export default function Logo({
  href = '/',
  size = 'md',
  wordmark = true,
  className = '',
  onClick,
}) {
  const markSize = size === 'lg' ? 'h-10 w-10 rounded-[13px]' : 'h-9 w-9 rounded-[11px]';
  const sparkSize = size === 'lg' ? 22 : 19;
  const textSize = size === 'lg' ? 'text-[25px]' : 'text-[22px]';

  return (
    <Link
      href={href}
      onClick={onClick}
      aria-label="Zest home"
      className={`group inline-flex items-center gap-2.5 rounded-xl ${className}`}
    >
      <span
        className={`relative grid shrink-0 place-items-center bg-gradient-to-br from-[#FFA45C] via-[#FF7628] to-[#E85D18] shadow-[0_8px_22px_rgba(232,93,24,0.28)] ${markSize}`}
      >
        <svg width={sparkSize} height={sparkSize} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M12 2.4c.7 5.2 3.2 7.7 8.4 8.4-5.2.7-7.7 3.2-8.4 8.4-.7-5.2-3.2-7.7-8.4-8.4C8.8 10.1 11.3 7.6 12 2.4Z"
            fill="#FFFFFF"
          />
        </svg>
        <span
          className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-lavender ring-2 ring-canvas"
          aria-hidden="true"
        />
      </span>

      {wordmark ? (
        <span
          className={`font-display font-semibold tracking-[-0.055em] text-ink ${textSize}`}
        >
          zest
        </span>
      ) : null}
    </Link>
  );
}
