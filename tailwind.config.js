/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'windows-blue': '#0078d4',
        'windows-blue-hover': '#106ebe',
        'windows-green': '#107c10',
        'windows-orange': '#ff8c00',
        'cool-grey': '#f3f3f3',
        'cool-grey-dark': '#e1e1e1',
        'windows-border': '#c0c0c0',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}


