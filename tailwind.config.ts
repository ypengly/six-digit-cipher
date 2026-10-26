import type { Config } from 'tailwindcss';

const v = (name: string) => `rgb(var(--${name}) / <alpha-value>)`;
const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: { bg: v('bg'), panel: v('panel'), edge: v('edge'), ink: v('ink'), mute: v('mute'), accent: v('accent'), accent2: v('accent2'), ok: v('ok'), bad: v('bad') },
      fontFamily: {
        display: ['"Segoe UI Variable Display"', '"Trebuchet MS"', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', '"Cascadia Code"', 'Menlo', 'Consolas', 'monospace'],
      },
      boxShadow: { neon: '0 0 0 1px rgb(var(--accent) / .4), 0 0 28px rgb(var(--accent) / .16)', violet: '0 0 0 1px rgb(var(--accent2) / .45), 0 0 28px rgb(var(--accent2) / .18)' },
    },
  },
  plugins: [],
};
export default config;
