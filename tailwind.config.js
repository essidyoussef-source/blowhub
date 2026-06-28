/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // ── Surfaces (gris neutres, minimalistes) ──────────────────────────
        ink: {
          950: '#f7f7f8', // fond de page (gris très clair neutre)
          900: '#ffffff',
          850: '#ffffff',
          800: '#f3f3f5', // hover / inputs
          700: '#e8e8ec', // bordure douce
          600: '#d6d6dc',
          500: '#b6b6bf',
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
        '4xl': '1rem',
      },
      boxShadow: {
        glow: '0 1px 2px rgba(26,27,31,0.10)',
        card: '0 1px 3px rgba(26,27,31,0.06), 0 1px 2px rgba(26,27,31,0.04)',
        soft: '0 1px 2px rgba(26,27,31,0.05)',
        pin: '0 4px 12px -4px rgba(26,27,31,0.18)',
        glass: '0 1px 3px rgba(26,27,31,0.06)',
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
