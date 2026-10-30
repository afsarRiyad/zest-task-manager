const ICONS = {
  overview: (
    <>
      <rect x="3.5" y="3.5" width="7" height="7" rx="2" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="2" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="2" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="2" />
    </>
  ),
  list: (
    <>
      <path d="M9 6h11" />
      <path d="M9 12h11" />
      <path d="M9 18h7" />
      <path d="M4.5 6h.01" />
      <path d="M4.5 12h.01" />
      <path d="M4.5 18h.01" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.5v2" />
      <path d="M12 19.5v2" />
      <path d="M4.2 4.2l1.4 1.4" />
      <path d="M18.4 18.4l1.4 1.4" />
      <path d="M2.5 12h2" />
      <path d="M19.5 12h2" />
      <path d="M4.2 19.8l1.4-1.4" />
      <path d="M18.4 5.6l1.4-1.4" />
    </>
  ),
  calendar: (
    <>
      <rect x="3.5" y="5" width="17" height="15.5" rx="3.5" />
      <path d="M8 3v4" />
      <path d="M16 3v4" />
      <path d="M3.5 10h17" />
    </>
  ),
  checkCircle: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M8.6 12.2l2.3 2.3 4.7-5.1" />
    </>
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3.1" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1.03 1.56V21a2 2 0 1 1-4 0v-.09A1.7 1.7 0 0 0 9 19.4a1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-1.56-1.03H3a2 2 0 1 1 0-4h.09A1.7 1.7 0 0 0 4.6 9a1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.7 1.7 0 0 0 9 4.6h.09A1.7 1.7 0 0 0 10.1 3.04V3a2 2 0 1 1 4 0v.09a1.7 1.7 0 0 0 1.03 1.56 1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.7 1.7 0 0 0 19.4 9v.09a1.7 1.7 0 0 0 1.56 1.03H21a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.51 1.03Z" />
    </>
  ),
  logout: (
    <>
      <path d="M9 5H6.2A2.2 2.2 0 0 0 4 7.2v9.6A2.2 2.2 0 0 0 6.2 19H9" />
      <path d="M15.5 8.5L19 12l-3.5 3.5" />
      <path d="M9.5 12H19" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.6-3.6" />
    </>
  ),
  plus: (
    <>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </>
  ),
  x: (
    <>
      <path d="M6 6l12 12" />
      <path d="M18 6L6 18" />
    </>
  ),
  check: <path d="M4.5 12.5l5 5L19.5 7" />,
  trash: (
    <>
      <path d="M4 7h16" />
      <path d="M9 7V5h6v2" />
      <path d="M6.5 7l.8 12.2A2 2 0 009.3 21h5.4a2 2 0 002-1.7L17.5 7" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
    </>
  ),
  pencil: (
    <>
      <path d="M4 20l4.5-1 10-10a2.5 2.5 0 0 0-3.5-3.5l-10 10L4 20z" />
      <path d="M13.5 6.5L17.5 10.5" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 1.8" />
    </>
  ),
  chevronDown: <path d="M6 9.5l6 6 6-6" />,
  chevronRight: <path d="M9.5 6l6 6-6 6" />,
  chevronUp: <path d="M6 14.5l6-6 6 6" />,
  arrowRight: (
    <>
      <path d="M4.5 12h15" />
      <path d="M13.5 6l6 6-6 6" />
    </>
  ),
  arrowUpRight: (
    <>
      <path d="M7 17L17 7" />
      <path d="M8 7h9v9" />
    </>
  ),
  undo: (
    <>
      <path d="M9 7L4.5 11.5 9 16" />
      <path d="M4.5 11.5H14a5 5 0 010 10h-2" />
    </>
  ),
  panelRight: (
    <>
      <rect x="3" y="4.5" width="18" height="15" rx="3" />
      <path d="M14.5 4.5v15" />
    </>
  ),
  panelLeft: (
    <>
      <rect x="3" y="4.5" width="18" height="15" rx="3" />
      <path d="M9.5 4.5v15" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8.5" r="3.5" />
      <path d="M5 20c.7-3.6 3.3-5.5 7-5.5s6.3 1.9 7 5.5" />
    </>
  ),
  lock: (
    <>
      <rect x="4.5" y="10" width="15" height="10" rx="3" />
      <path d="M8 10V7.5a4 4 0 018 0V10" />
      <path d="M12 14v2" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5.5" width="18" height="13" rx="3.5" />
      <path d="M4.5 7.5l7.5 5.5 7.5-5.5" />
    </>
  ),
  eye: (
    <>
      <path d="M2.5 12S6 5.8 12 5.8 21.5 12 21.5 12 18 18.2 12 18.2 2.5 12 2.5 12z" />
      <circle cx="12" cy="12" r="3.1" />
    </>
  ),
  eyeOff: (
    <>
      <path d="M3 3l18 18" />
      <path d="M10.6 6.1A9.8 9.8 0 0112 6c6 0 9.5 6 9.5 6a17 17 0 01-3.2 3.8" />
      <path d="M6.3 6.9A17.5 17.5 0 002.5 12S6 18 12 18a9 9 0 004.1-.9" />
      <path d="M9.9 9.9a3 3 0 004.2 4.2" />
    </>
  ),
  sparkles: (
    <>
      <path d="M12 3.5l1.7 4.3 4.3 1.7-4.3 1.7L12 15.5l-1.7-4.3L6 9.5l4.3-1.7L12 3.5z" />
      <path d="M18 15.5l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8.8-2z" />
    </>
  ),
  briefcase: (
    <>
      <rect x="3" y="7.5" width="18" height="12" rx="3.5" />
      <path d="M9 7.5V6a2 2 0 012-2h2a2 2 0 012 2v1.5" />
      <path d="M3 12.5h18" />
    </>
  ),
  book: (
    <>
      <path d="M12 6.5c-2-1.6-4.4-2-7-2v13c2.6 0 5 .4 7 2 2-1.6 4.4-2 7-2v-13c-2.6 0-5 .4-7 2z" />
      <path d="M12 6.5v13" />
    </>
  ),
  heart: (
    <path d="M12 20s-7.5-4.6-7.5-9.5A4.5 4.5 0 0112 7a4.5 4.5 0 017.5 3.5C19.5 15.4 12 20 12 20z" />
  ),
  home: (
    <path d="M4 10.5L12 4l8 6.5V20a1 1 0 01-1 1h-4.5v-6h-5v6H5a1 1 0 01-1-1v-9.5z" />
  ),
  bolt: <path d="M13 3L5 13.5h5.5L11 21l8-10.5h-5.5L13 3z" />,
  moon: <path d="M20 14.5A8.5 8.5 0 019.5 4 8.5 8.5 0 1020 14.5z" />,
  target: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  filter: (
    <>
      <path d="M4 6h16" />
      <path d="M7 12h10" />
      <path d="M10 18h4" />
    </>
  ),
  sort: (
    <>
      <path d="M8 4v16" />
      <path d="M4.5 7.5L8 4l3.5 3.5" />
      <path d="M16 20V4" />
      <path d="M12.5 16.5L16 20l3.5-3.5" />
    </>
  ),
  alert: (
    <>
      <path d="M12 3.5l9 16H3l9-16z" />
      <path d="M12 9v4.5" />
      <path d="M12 17h.01" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 11v5" />
      <path d="M12 8h.01" />
    </>
  ),
  loader: <path d="M12 3.5a8.5 8.5 0 108.5 8.5" />,
  more: (
    <>
      <circle cx="5" cy="12" r="1" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
      <circle cx="19" cy="12" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  menu: (
    <>
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h16" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3.5l7.5 2.7v5.5c0 4.5-3 7.4-7.5 9-4.5-1.6-7.5-4.5-7.5-9V6.2L12 3.5z" />
      <path d="M8.7 12l2.2 2.2 4.4-4.7" />
    </>
  ),
  command: (
    <path d="M9 6.5A2.5 2.5 0 106.5 9H9m0-2.5v11m0-8.5H6.5A2.5 2.5 0 109 15m0-6h6m0 0V6.5A2.5 2.5 0 1117.5 9H15m0 0H9m6 0v6m0 0h2.5A2.5 2.5 0 1115 17.5V15m0 0H9" />
  ),
  inbox: (
    <>
      <path d="M4 5.5h16l1.2 9.5a3 3 0 01-3 3.4H5.8a3 3 0 01-3-3.4L4 5.5z" />
      <path d="M3 13h5l1.2 2.2h5.6L16 13h5" />
    </>
  ),
  arrowLeft: (
    <>
      <path d="M19.5 12h-15" />
      <path d="M10.5 6l-6 6 6 6" />
    </>
  ),
};

export default function Icon({ name, size = 20, strokeWidth = 1.7, className = '', ...rest }) {
  const paths = ICONS[name];
  if (!paths) return null;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {paths}
    </svg>
  );
}
