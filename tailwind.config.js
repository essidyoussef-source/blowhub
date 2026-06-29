/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // ── Surfaces (lavande très clair, cartes flottantes) ───────────────
        ink: {
          950: '#efeafb', // fond de page (base lavande, dégradé par-dessus)
          900: '#ffffff',
          850: '#ffffff',
          800: '#f4f1fb', // hover / inputs
          700: '#ece7f8', // bordure douce
          600: '#ddd5f0',
          500: '#bdb2e0',
        },
        // ── Texte (échelle gris charbon neutre) ────────────────────────────
        slate: {
          50: '#ffffff',
          100: '#1a1b1f', // titres / texte fort
          200: '#2a2b30',
          300: '#42434a', // corps de texte
          400: '#8a8b94', // texte secondaire / muted
          500: '#a4a5ad',
          600: '#c6c6cd',
          700: '#3a3b42',
          800: '#26272c',
          900: '#1a1b1f',
        },
        // ── Marque : Violet périwinkle (action principale) ─────────────────
        blow: {
          50: '#f2effe',
          100: '#e8e2fd',
          200: '#d4c9fb',
          300: '#b9a7f7',
          400: '#9d85f4',
          500: '#7b6cf5',
          600: '#6a54ee',
          700: '#5a42d6',
          800: '#4a37ad',
          900: '#3f3290',
        },
        // ── Palette pastel (mesh neo-apple) ────────────────────────────────
        grape: { DEFAULT: '#8f7cf8', soft: '#e7e0fb' },
        peri: { DEFAULT: '#7c9bf2', soft: '#dce6fb' },
        peach: { DEFAULT: '#f6a978', soft: '#fce6d6' },
        blush: { DEFAULT: '#ef93c0', soft: '#fbdcec' },
        mint: { DEFAULT: '#5fcdb6', soft: '#d6f1ea' },
        sky: { DEFAULT: '#62b6e8', soft: '#d6ecf9' },
        sunset: { DEFAULT: '#f6a978', soft: '#fce6d6' },
        aqua: { DEFAULT: '#5fcdd6', soft: '#d6f1f3' },
        lime: { DEFAULT: '#a8b81f', soft: '#eef2c4' },
        rose: { DEFAULT: '#ef93c0', soft: '#fbdcec' },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '4xl': '2.25rem',
      },
      boxShadow: {
        glow: '0 10px 26px -10px rgba(123,108,245,0.45)',
        card: '0 14px 44px -20px rgba(91,66,180,0.28), 0 2px 8px -4px rgba(91,66,180,0.10)',
        soft: '0 8px 24px -14px rgba(91,66,180,0.22)',
        pin: '0 16px 34px -14px rgba(60,40,120,0.26)',
        glass: '0 14px 44px -20px rgba(91,66,180,0.26)',
      },
      keyframes: {
        'fade-in': { '0%': { opacity: '0', transform: 'translateY(6px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-6px)' } },
        blob: { '0%,100%': { borderRadius: '42% 58% 60% 40% / 50% 44% 56% 50%' }, '50%': { borderRadius: '58% 42% 40% 60% / 44% 56% 44% 56%' } },
      },
      animation: { 'fade-in': 'fade-in 0.25s ease-out', float: 'float 6s ease-in-out infinite', blob: 'blob 12s ease-in-out infinite' },
    },
  },
  plugins: [],
}
