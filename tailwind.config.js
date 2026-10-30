/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './features/**/*.{js,jsx}',
    './lib/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        canvas: 'rgb(var(--canvas) / <alpha-value>)',
        surface: 'rgb(var(--surface) / <alpha-value>)',
        card: 'rgb(var(--card) / <alpha-value>)',
        elevated: 'rgb(var(--elevated) / <alpha-value>)',
        overlay: 'rgb(var(--overlay) / <alpha-value>)',
        ink: {
          DEFAULT: 'rgb(var(--ink) / <alpha-value>)',
          2: 'rgb(var(--ink-2) / <alpha-value>)',
          3: 'rgb(var(--ink-3) / <alpha-value>)',
        },
        line: 'rgb(var(--line) / <alpha-value>)',
        'line-strong': 'rgb(var(--line-strong) / <alpha-value>)',
        accent: {
          DEFAULT: 'rgb(var(--accent) / <alpha-value>)',
          deep: 'rgb(var(--accent-deep) / <alpha-value>)',
          dim: 'rgb(var(--accent-dim) / <alpha-value>)',
          soft: 'rgb(var(--accent-soft) / <alpha-value>)',
        },
        'on-accent': 'rgb(var(--on-accent) / <alpha-value>)',
        // Legacy violet classes resolve to the primary accent so older markup stays themed.
        violet: {
          DEFAULT: 'rgb(var(--accent) / <alpha-value>)',
          deep: 'rgb(var(--accent-deep) / <alpha-value>)',
          dim: 'rgb(var(--accent-dim) / <alpha-value>)',
        },
        lavender: {
          DEFAULT: 'rgb(var(--lavender) / <alpha-value>)',
          soft: 'rgb(var(--lavender-soft) / <alpha-value>)',
        },
        cyan: {
          DEFAULT: 'rgb(var(--cyan) / <alpha-value>)',
          deep: 'rgb(var(--lavender) / <alpha-value>)',
        },
        mint: 'rgb(var(--mint) / <alpha-value>)',
        amber: 'rgb(var(--amber) / <alpha-value>)',
        rose: 'rgb(var(--rose) / <alpha-value>)',
        blue: 'rgb(var(--blue) / <alpha-value>)',
        priority: {
          high: 'rgb(var(--priority-high) / <alpha-value>)',
          medium: 'rgb(var(--priority-medium) / <alpha-value>)',
          low: 'rgb(var(--priority-low) / <alpha-value>)',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        display: ['var(--font-jakarta)', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        editorial: ['var(--font-jakarta)', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      borderRadius: {
        card: '22px',
        panel: '26px',
        field: '14px',
      },
      boxShadow: {
        panel:
          '0 1px 0 rgb(255 255 255 / 0.5) inset, 0 18px 40px rgb(var(--shadow-color) / 0.08)',
        float: '0 24px 60px rgb(var(--shadow-color) / 0.18)',
        soft: '0 10px 26px rgb(var(--accent) / 0.24)',
        violet: '0 12px 30px rgb(var(--accent) / 0.24)',
      },
      transitionTimingFunction: {
        out: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        shimmer: 'shimmer 1.8s linear infinite',
      },
      maxWidth: {
        shell: '1520px',
      },
    },
  },
  plugins: [],
};
