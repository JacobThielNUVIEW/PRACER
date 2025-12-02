/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // Added: Enables class-based dark mode (e.g., <html class="dark">)
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Official NeverStop Palette
        slate: {
          50: "#f8fafc",
          900: "#0f172a",
          950: "#020617",
        },
        gold: {
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
          DEFAULT: "#f59e0b",
        },
        silver: {
          400: "#e5e7eb",
          500: "#cfd8dc",
          600: "#b0b6be",
          DEFAULT: "#cfd8dc",
        },
        emerald: {
          400: "#34d399",
          500: "#10b981",
          600: "#059669",
          DEFAULT: "#10b981",
        },
        teal: {
          400: "#2dd4bf",
          500: "#14b8a6",
          600: "#0d9488",
          DEFAULT: "#14b8a6",
        black: {
          DEFAULT: "#111111"
        },
  orange: "#f97316"
        orange: "#f97316",
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