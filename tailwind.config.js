/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // Added: Enables class-based dark mode (e.g., <html class="dark">)
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // RACELAY Palette (canonical mapping)
        rac: {
          depth:   'var(--rac-depth, #0B0C10)',
          surface: 'var(--rac-surface, #13151A)',
          border:  'var(--rac-border, #272A33)',
          blue:    'var(--rac-blue, #0EA5E9)',
          'blue-dark': 'var(--rac-blue-dark, #0284C7)',
          glow:    'var(--rac-blue-glow, rgba(14,165,233,0.2))',
          signal:  'var(--rac-signal, #F97316)',
          success: 'var(--rac-success, #10B981)',
          warning: 'var(--rac-warning, #FACC15)',
          danger:  'var(--rac-danger, #EF4444)',
          text:    'var(--rac-text-main, #F1F5F9)',
          muted:   'var(--rac-text-muted, #94A3B8)',
        },
        // Legacy palette kept for backwards compatibility
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
        partner: {
          strava: 'var(--brand-strava, #FC4C02)',
          garmin: 'var(--brand-garmin, #00A3E0)',
          apple: 'var(--brand-apple, #34C759)',
          nike: 'var(--brand-nike, #E11931)',
        },
        orange: 'var(--rac-orange, #f97316)'
      },
      fontFamily: {
        hud: ['Chakra Petch', 'sans-serif'],
        data: ['JetBrains Mono', 'monospace'],
        body: ['Inter', 'sans-serif'],
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