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
        // Kept `udemy.*` keys for compatibility; values remapped to SADI brand
        udemy: {
          purple: '#2B3960',      // Brand navy (primary)
          darkPurple: '#1F2A48',  // Deeper navy for hover
          black: '#1A2238',
          gray: '#F4F7F5',        // Soft sage-tinted surface
          grayBorder: '#D5E0DA',
          white: '#ffffff',
          accent: '#A2CEB7',      // Brand sage
        },
        amber: {
          500: '#2B3960',
          400: '#1F2A48',
          300: '#D5E0DA',
        },
        emerald: {
          50: '#F0F8F4',
          100: '#DCEFE6',
          200: '#B8DEC9',
          300: '#A2CEB7',
          400: '#7FBA9A',
          500: '#5A9F7C',
          600: '#457A5F',
          700: '#365E49',
        },
        sadi: {
          navy: '#2B3960',
          darkNavy: '#1F2A48',
          card: '#F4F7F5',
          gold: '#A2CEB7',
          lightGold: '#C5E2D3',
          darkGold: '#5A9F7C',
          accentBlue: '#2B3960',
          sage: '#A2CEB7',
          sageDeep: '#5A9F7C',
        },
        brand: {
          navy: '#2B3960',
          navyDark: '#1F2A48',
          sage: '#A2CEB7',
          sageDeep: '#5A9F7C',
          slate: '#1A2238',
          accent: '#A2CEB7',
          surface: '#F4F7F5',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'Segoe UI', 'sans-serif'],
        display: ['var(--font-display)', 'Georgia', 'serif'],
      },
      boxShadow: {
        brand: '0 10px 30px -12px rgba(43, 57, 96, 0.35)',
        sage: '0 8px 24px -10px rgba(162, 206, 183, 0.55)',
      },
    },
  },
  plugins: [],
};
