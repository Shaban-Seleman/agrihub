import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        soil: '#735c00',
        leaf: '#012d1d',
        moss: '#264e3c',
        sand: '#f4f4f0',
        cream: '#faf9f5',
        mist: '#e9e8e4',
        sun: '#d4af37',
        ink: '#00160c',
        line: '#c1c8c2',
        muted: '#414844'
      },
      fontFamily: {
        headline: ['Newsreader', 'serif'],
        body: ['Manrope', 'sans-serif'],
        label: ['Manrope', 'sans-serif']
      },
      boxShadow: {
        card: '0 18px 40px rgba(38, 78, 60, 0.08)',
        float: '0 12px 28px rgba(0, 22, 12, 0.12)'
      },
      borderRadius: {
        xl2: '1.25rem',
        panel: '2rem'
      }
    }
  },
  plugins: []
};

export default config;
