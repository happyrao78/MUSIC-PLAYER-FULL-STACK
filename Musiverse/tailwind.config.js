/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './public/**/*.html',         // Scans all HTML files in the public folder
    './src/**/*.{html,js,jsx,ts,tsx}',  // Scans all HTML, JS, JSX, TS, TSX files in the src folder
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

