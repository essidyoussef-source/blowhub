/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // ── Surfaces (lavande clair, glassy) ───────────────────────────────
        ink: {
          950: '#efebfb', // fond de page (lavande très doux)
          900: '#ffffff',
          850: '#ffffff',
          800: '#f5f1fd', // hover / inputs
          700: '#ebe5f9', // bordure douce
          600: '#ddd4f2',
          500: '#c7baea',
        },
        // ── Texte (échelle sombre→clair, teinté violet) ────────────────────
        slate: {
          50: '#ffffff',
          100: '#241a45',
          200: '#322a55',
          300: '#5a5278',
          400: '#837ba0',
          500: '#a49cc2',
          600: '#c3bcdd',
          700: '#433b66',
          800: '#2e2650',
          900: '#221a42',
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
        '4xl': '2rem',
      },
      boxShadow: {
        glow: '0 12px 30px -10px rgba(123,108,245,0.50)',
        card: '0 14px 44px -18px rgba(90,66,214,0.26)',
        soft: '0 6px 20px -8px rgba(90,66,214,0.18)',
        pin: '0 16px 34px -14px rgba(34,26,66,0.30)',
        glass: '0 8px 32px -12px rgba(90,66,214,0.22), inset 0 1px 0 rgba(255,255,255,0.6)',
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
