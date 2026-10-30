import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import Providers from '@/components/Providers';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-jakarta',
  display: 'swap',
});

const themeScript = `(function(){try{var t=localStorage.getItem('zest-theme')||'light';var d=t==='dark'||(t==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches);var r=document.documentElement;r.classList.toggle('dark',d);r.style.colorScheme=d?'dark':'light';}catch(e){}})();`;

export const metadata = {
  title: {
    default: 'Zest — Make room for momentum',
    template: '%s — Zest',
  },
  description:
    'A task manager with a focus companion who reads the room, keeps the plan light, and makes finishing feel good.',
  applicationName: 'Zest',
  icons: {
    icon: '/icon.svg',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#FFFCF8',
  colorScheme: 'light dark',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${jakarta.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <div className="ambient" aria-hidden="true">
          <div className="ambient-grain" />
        </div>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
