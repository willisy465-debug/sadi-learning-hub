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
        udemy: {
          purple: '#5624d0',
          darkPurple: '#401b9c',
          black: '#1c1d1f',
          gray: '#f7f9fa',
          grayBorder: '#d1d7dc',
          white: '#ffffff',
          accent: '#401b9c',
        },
        amber: {
          500: '#5624d0', // Mapped to Udemy Purple
          400: '#401b9c', // Mapped to Udemy Dark Purple
          300: '#d1d7dc', // Mapped to gray border
        },
        emerald: {
          500: '#61CE70', 
          400: '#61CE70',
          300: '#61CE70',
        },
        sadi: {
          navy: '#1c1d1f', // Mapped to Udemy Black
          darkNavy: '#1c1d1f', // Mapped to Udemy Black
          card: '#f7f9fa', // Udemy light gray
          gold: '#5624d0', // Udemy Purple
          lightGold: '#401b9c', // Udemy Dark Purple
          darkGold: '#5624d0',
          accentBlue: '#5624d0',
        },
        brand: {
          navy: '#1c1d1f',
          gold: '#5624d0',
          slate: '#1c1d1f',
          accent: '#5624d0',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
