/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // ── Surfaces (thème clair, lumineux) ───────────────────────────────
        // "ink-*" = fonds clairs (du plus doux au plus blanc).
        ink: {
          950: '#fcf6fb', // fond de page (rosé très doux)
          900: '#ffffff', // sidebar / barres
          850: '#ffffff', // cartes
          800: '#fbf2f8', // hover / inputs
          700: '#f3e9f1', // bordure douce
          600: '#e7d9e6',
          500: '#d2c2d2',
        },
        // ── Texte (échelle sombre→clair pour fond clair) ───────────────────
        slate: {
          50: '#ffffff',
          100: '#1d1633',
          200: '#2a2342',
          300: '#4f4965',
          400: '#736d88',
          500: '#938da6',
          600: '#b4afc4',
          700: '#3d3852',
          800: '#28223e',
          900: '#1a1430',
        },
        // ── Marque : Electric Rose (action principale) ─────────────────────
        blow: {
          50: '#fef0f6',
          100: '#fde0ec',
          200: '#fbc1da',
          300: '#f892bd',
          400: '#f25596',
          500: '#ec1763', // Electric Rose
          600: '#d40f53',
          700: '#b00d46',
          800: '#910f3e',
          900: '#7a1139',
        },
        // ── Palette créative (photo DA) ────────────────────────────────────
        sky: { DEFAULT: '#5568af', soft: '#e4e8f5' },
        aqua: { DEFAULT: '#4cc4d6', soft: '#ceeaee' },
        lime: { DEFAULT: '#a8b81f', soft: '#eef2c4', bright: '#cdd629' },
        rose: { DEFAULT: '#ec1763', soft: '#f8c9dd' },
        blush: { DEFAULT: '#ef7fb0', soft: '#f8c9dd' },
        sunset: { DEFAULT: '#f37826', soft: '#fde0cd' },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Fraunces"', 'Inter', 'serif'],
      },
      boxShadow: {
        glow: '0 8px 24px -8px rgba(236,23,99,0.45)',
        card: '0 1px 2px rgba(26,20,48,0.04), 0 12px 32px -16px rgba(85,104,175,0.22)',
        soft: '0 2px 10px -4px rgba(26,20,48,0.10)',
        pin: '0 14px 30px -12px rgba(26,20,48,0.30)',
      },
      keyframes: {
        'fade-in': { '0%': { opacity: '0', transform: 'translateY(4px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-4px)' } },
      },
      animation: { 'fade-in': 'fade-in 0.2s ease-out', float: 'float 4s ease-in-out infinite' },
    },
  },
  plugins: [],
}
