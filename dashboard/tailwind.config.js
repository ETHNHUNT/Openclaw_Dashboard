/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        eth: {
          950: '#05050a',
          900: '#0f0f14',
          800: '#1a1a22',
          700: '#252530',
          600: '#3a3a45',
          500: '#4a4a55',
          accent: '#06b6d4',
          'accent-dark': '#0891b2',
          'accent-light': '#22d3ee',
        }
      },
      boxShadow: {
        'eth-sm': '0 1px 3px rgba(6, 182, 212, 0.1)',
        'eth-md': '0 4px 12px rgba(6, 182, 212, 0.15)',
        'eth-lg': '0 8px 24px rgba(6, 182, 212, 0.2)',
      },
      animation: {
        'pulse-eth': 'pulse-eth 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        'pulse-eth': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '.8' },
        }
      }
    },
  },
  plugins: [],
}
