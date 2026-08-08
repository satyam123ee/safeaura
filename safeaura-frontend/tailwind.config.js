/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#1a0b2e',
        surface: '#241238',
        primary: '#a855f7',
        accent: '#ec4899',
        muted: '#9d8bb0',
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
      },
    },
  },
  plugins: [],
};
