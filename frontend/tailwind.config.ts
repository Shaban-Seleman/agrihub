import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        soil: '#6b4d2c',
        leaf: '#2f6b3b',
        sand: '#f2e7c9',
        cream: '#fbf8ef',
        sun: '#d59d2a',
        ink: '#142018'
      },
      boxShadow: {
        card: '0 18px 40px rgba(20, 32, 24, 0.08)'
      },
      borderRadius: {
        xl2: '1.25rem'
      }
    }
  },
  plugins: []
};

export default config;
