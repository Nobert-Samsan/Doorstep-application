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
        heading: ['Poppins', 'sans-serif'],
      },
      colors: {
        primary: '#D97706',
        secondary: '#F59E0B',
        accent: '#FCD34D',
        'light-accent': '#FDE68A',
        background: '#FFFBEB',
        'card-bg': '#FEFCE8',
        success: '#16A34A',
        warning: '#EA580C',
        danger: '#DC2626',
        info: '#2563EB',
        'text-primary': '#1C1917',
        'text-secondary': '#78716C',
        'text-hint': '#A8A29E',
        border: '#FDE68A',
        sidebar: '#78350F',
      },
      animation: {
        fadeIn: 'fadeIn 0.3s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}
