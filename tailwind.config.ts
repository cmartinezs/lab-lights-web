import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        lab: {
          bg: '#07100f',
          panel: '#101b1a',
          panelStrong: '#172726',
          line: '#2a4a47',
          text: '#e8fff8',
          muted: '#9ec6bd',
          cyan: '#3ee7d6',
          amber: '#f6b84b',
          green: '#78f26d',
          red: '#ff5d6c',
        },
      },
      boxShadow: {
        glow: '0 0 28px rgb(62 231 214 / 0.32)',
        light: '0 0 20px rgb(120 242 109 / 0.45)',
      },
      fontFamily: {
        display: ['"Trebuchet MS"', 'system-ui', 'sans-serif'],
        mono: ['"SFMono-Regular"', 'Consolas', 'monospace'],
      },
      borderRadius: {
        panel: '0.5rem',
      },
    },
  },
  plugins: [],
} satisfies Config;
