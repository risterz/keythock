/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          dark: '#0f1117',
          card: '#161922',
          accent: '#00f5ff',
          neon: '#ff007f',
          gold: '#ffd700'
        }
      }
    },
  },
  plugins: [],
}
