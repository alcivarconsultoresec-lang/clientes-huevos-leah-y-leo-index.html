/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        panel: '0 18px 55px rgba(0, 0, 0, 0.28)',
      },
    },
  },
  plugins: [],
}
