/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#0b0b13',
          900: '#12121d',
          850: '#181826',
          800: '#1e1e2e',
          700: '#2a2a3c',
          600: '#3a3a52',
          500: '#55556f',
        },
        blow: {
          50: '#fff1f6',
          100: '#ffe4ee',
          200: '#ffc9dd',
          300: '#ff9dbf',
          400: '#ff5e96',
          500: '#ff2d77',
          600: '#ed1361',
          700: '#c80b50',
          800: '#a60d47',
          900: '#8a1041',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(255,45,119,0.25), 0 8px 30px -8px rgba(255,45,119,0.35)',
        card: '0 1px 0 0 rgba(255,255,255,0.04) inset, 0 8px 24px -12px rgba(0,0,0,0.6)',
      },
      keyframes: {
        'fade-in': { '0%': { opacity: '0', transform: 'translateY(4px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
      },
      animation: { 'fade-in': 'fade-in 0.2s ease-out' },
    },
  },
  plugins: [],
}
