/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in-left': {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'fade-in-right': {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'float-1': {
          '0%, 100%': { transform: 'translateY(0) rotate(-10deg)' },
          '50%': { transform: 'translateY(-20px) rotate(-15deg)' },
        },
        'float-2': {
          '0%, 100%': { transform: 'translateY(0) rotate(15deg)' },
          '50%': { transform: 'translateY(-15px) rotate(20deg)' },
        },
        'float-3': {
          '0%, 100%': { transform: 'translateY(0) rotate(-5deg)' },
          '50%': { transform: 'translateY(-25px) rotate(-10deg)' },
        },
        'float-4': {
          '0%, 100%': { transform: 'translateY(0) rotate(8deg)' },
          '50%': { transform: 'translateY(-18px) rotate(12deg)' },
        },
        'float-5': {
          '0%, 100%': { transform: 'translateY(0) rotate(6deg)' },
          '50%': { transform: 'translateY(-22px) rotate(10deg)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 1s ease-out forwards',
        'fade-in-up': 'fade-in-up 0.8s ease-out forwards',
        'fade-in-left': 'fade-in-left 0.8s ease-out forwards',
        'fade-in-right': 'fade-in-right 0.8s ease-out forwards',
        'float-1': 'float-1 6s ease-in-out infinite',
        'float-2': 'float-2 7s ease-in-out infinite',
        'float-3': 'float-3 8s ease-in-out infinite',
        'float-4': 'float-4 6.5s ease-in-out infinite',
        'float-5': 'float-5 7.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
  darkMode: 'class',
}