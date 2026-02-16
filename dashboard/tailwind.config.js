/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
      colors: {
        eth: {
          950: '#020617', // Slate 950 (Background)
          900: '#0f172a', // Slate 900 (Cards/Sidebar)
          800: '#1e293b', // Slate 800 (Secondary/Hover)
          700: '#334155', // Slate 700 (Borders)
          600: '#475569', // Slate 600 (Muted Text)
          500: '#64748b', // Slate 500 (Icon/Meta)
          400: '#94a3b8', // Slate 400 (Body Text)
          300: '#cbd5e1', // Slate 300 (Light Text)
          accent: '#8b5cf6', // Violet 500 (Primary Action)
          'accent-dark': '#7c3aed', // Violet 600
          'accent-light': '#a78bfa', // Violet 400
        }
      },
      boxShadow: {
        'eth-sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'eth-md': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        'eth-lg': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        'glow': '0 0 20px -5px rgba(139, 92, 246, 0.3)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}
