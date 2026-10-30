const PALETTES = [
  ['#C4B5FD', '#7C3AED'],
  ['#A5F3FC', '#0E7490'],
  ['#F5D0FE', '#A21CAF'],
  ['#A7F3D0', '#047857'],
  ['#FDE68A', '#B45309'],
  ['#FECDD3', '#BE123C'],
];

function initialsFor(name) {
  const parts = String(name || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (!parts.length) return 'Z';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function paletteFor(name) {
  let hash = 0;
  const value = String(name || 'zest');
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) % 997;
  }
  return PALETTES[hash % PALETTES.length];
}

export default function Avatar({ name, size = 36, className = '', ring = true }) {
  const [from, to] = paletteFor(name);
  const initials = initialsFor(name);

  return (
    <span
      className={`inline-grid shrink-0 place-items-center overflow-hidden rounded-full font-display font-semibold text-[#0B0D12] ${
        ring ? 'ring-1 ring-ink/10' : ''
      } ${className}`}
      style={{
        width: size,
        height: size,
        fontSize: Math.max(10, size * 0.34),
        background: `linear-gradient(145deg, ${from}, ${to})`,
      }}
      aria-hidden="true"
    >
      {initials}
    </span>
  );
}
