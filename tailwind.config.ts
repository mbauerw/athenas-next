import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './views/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Crimson Text"', 'serif'],
        sans: ['"Lato"', 'sans-serif'],
      },
      colors: {
        library: {
          wood: '#4a3728',
          woodLight: '#8c6b4a',
          paper: '#fdfbf7',
          paperDark: '#f0ece2',
          green: '#2f4f2f',
          gold: '#d4af37',
          ink: '#2b2b2b',
        },
      },
    },
  },
  plugins: [],
};

export default config;
