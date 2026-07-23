/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        sadi: {
          navy: '#0F2942',
          darkNavy: '#070E1B',
          card: '#13243C',
          gold: '#D4AF37',
          lightGold: '#F4E07B',
          darkGold: '#A68018',
          accentBlue: '#1D4ED8',
        },
        brand: {
          navy: '#0F2942',
          gold: '#D4AF37',
          slate: '#1E293B',
          accent: '#2563EB',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
