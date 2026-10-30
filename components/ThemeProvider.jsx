'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const ThemeContext = createContext({
  theme: 'light',
  resolvedTheme: 'light',
  setTheme: () => {},
});

const STORAGE_KEY = 'zest-theme';
const MEDIA = '(prefers-color-scheme: dark)';

function systemTheme() {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia(MEDIA).matches ? 'dark' : 'light';
}

function applyTheme(resolved) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  root.classList.toggle('dark', resolved === 'dark');
  root.style.colorScheme = resolved;
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', resolved === 'dark' ? '#141211' : '#FFFCF8');
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState('light');
  const [resolvedTheme, setResolvedTheme] = useState('light');

  useEffect(() => {
    let stored = 'light';
    try {
      stored = window.localStorage.getItem(STORAGE_KEY) || 'light';
    } catch {
      stored = 'light';
    }
    const resolved = stored === 'system' ? systemTheme() : stored;
    setThemeState(stored);
    setResolvedTheme(resolved);
    applyTheme(resolved);
  }, []);

  useEffect(() => {
    if (theme !== 'system') return undefined;
    const media = window.matchMedia(MEDIA);
    const onChange = () => {
      const next = media.matches ? 'dark' : 'light';
      setResolvedTheme(next);
      applyTheme(next);
    };
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, [theme]);

  const setTheme = useCallback((next) => {
    const value = next === 'dark' || next === 'system' ? next : 'light';
    const resolved = value === 'system' ? systemTheme() : value;
    setThemeState(value);
    setResolvedTheme(resolved);
    applyTheme(resolved);
    try {
      window.localStorage.setItem(STORAGE_KEY, value);
    } catch {
      // A blocked storage API should never prevent the theme from changing.
    }
  }, []);

  const value = useMemo(
    () => ({ theme, resolvedTheme, setTheme }),
    [theme, resolvedTheme, setTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
