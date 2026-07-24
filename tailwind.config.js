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
        amber: {
          500: '#060097', // Primary Dark Blue (was Gold)
          400: '#00b1f8', // Cyan Accent (was Light Gold)
          300: '#ffcd57', // Secondary Yellow Accent
        },
        emerald: {
          500: '#61CE70', // Primary Green Accent
          400: '#61CE70',
          300: '#61CE70',
        },
        sadi: {
          navy: '#060097', // Updated to primary dark blue
          darkNavy: '#171462', // Submenu background
          card: '#F2F5F7', // Updated to light grey-blue
          gold: '#00b1f8', // Updated to cyan accent
          lightGold: '#ffcd57',
          darkGold: '#060097',
          accentBlue: '#00b1f8',
        },
        brand: {
          navy: '#060097',
          gold: '#00b1f8',
          slate: '#1e293b',
          accent: '#00b1f8',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
