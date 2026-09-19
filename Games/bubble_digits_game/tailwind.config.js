/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sage: {
          light: '#e2eed4',
          medium: '#c5dbb4',
          olive: '#9fbfa1',
          dark: '#7a9a7b',
        },
        bubble: {
          blue: '#1e3a8a',
          yellow: '#eab308',
          red: '#dc2626',
          green: '#10b981',
          purple: '#9333ea',
          orange: '#f97316',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
