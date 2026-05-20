import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        lab: {
          bg:          '#06100f',
          'bg-deep':   '#040a0a',
          panel:       '#0c1816',
          'panel-2':   '#122220',
          'panel-3':   '#18302d',
          // keep legacy aliases used in existing components
          panelStrong: '#122220',
          line:        '#2a4a47',
          'line-soft': '#1b322f',
          text:        '#e8fff8',
          'text-2':    '#b6d4cd',
          muted:       '#7fa39c',
          dim:         '#4f7670',
          cyan:        '#3ee7d6',
          'cyan-dim':  '#1f8a7f',
          green:       '#78f26d',
          'green-dim': '#2a8b4b',
          amber:       '#f6b84b',
          'amber-dim': '#8a6420',
          red:         '#ff5d6c',
          'red-dim':   '#7a2a32',
        },
      },
      fontFamily: {
        mono:    ['"IBM Plex Mono"', 'ui-monospace', 'Consolas', 'monospace'],
        display: ['"Space Grotesk"', '"Helvetica Neue"', 'Helvetica', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        panel: '0.5rem',
      },
      boxShadow: {
        glow:  '0 0 28px rgb(62 231 214 / 0.32)',
        light: '0 0 20px rgb(120 242 109 / 0.45)',
      },
    },
  },
  plugins: [],
} satisfies Config;
