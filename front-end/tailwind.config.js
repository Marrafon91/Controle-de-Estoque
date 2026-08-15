export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: { 50: '#F5F3FF', 100: '#EDE9FE', 500: '#7C3AED', 600: '#6D28D9', 700: '#5B21B6' },
        warn: { 100: '#FEF3C7', 500: '#F59E0B', 600: '#D97706' },
        danger: { 100: '#FFE4E6', 500: '#F43F5E', 600: '#E11D48' },
        success: { 500: '#22C55E', 600: '#16A34A' },
        info: { 600: '#2563EB' },
        surface: '#F8F7FB',
      },
      fontFamily: { sans: ['Inter', 'sans-serif'] },
    },
  },
};
