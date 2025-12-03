/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // Added: Enables class-based dark mode (e.g., <html class="dark">)
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Official NeverStop Palette (mapped to design tokens via CSS variables)
        slate: {
          50: "#f8fafc",
          900: "#0f172a",
          950: "#020617",
        },
        gold: {
          400: 'var(--gold-400, #fbbf24)',
          500: 'var(--gold-500, #f59e0b)',
          600: 'var(--gold-600, #d97706)',
          DEFAULT: 'var(--gold, #f59e0b)',
        },
        silver: {
          400: 'var(--silver-400, #e5e7eb)',
          500: 'var(--silver-500, #cfd8dc)',
          600: 'var(--silver-600, #b0b6be)',
          DEFAULT: 'var(--silver, #cfd8dc)',
        },
        emerald: {
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          DEFAULT: '#10b981',
        },
        teal: {
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          DEFAULT: '#14b8a6',
        },
        black: {
          DEFAULT: 'var(--strava-dark, #111111)'
        },
        // Strava brand / activity orange
        strava: {
          400: 'var(--strava-orange, #FC4C02)',
          500: 'var(--strava-orange, #FC4C02)',
          600: 'var(--btn-strava-hover, #FF6B2B)',
          DEFAULT: 'var(--strava-orange, #FC4C02)'
        },
        orange: 'var(--rac-orange, #f97316)'
      },
      animation: {
        'pulse-gold': 'pulse-gold 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        'pulse-gold': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};