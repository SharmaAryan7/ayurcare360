/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'ayur-green': {
          light: '#F1F8F6', // Page backgrounds 
          DEFAULT: '#2D5A27', // Primary buttons/icons
          dark: '#1B3D18',
        },
        'ayur-orange': {
          DEFAULT: '#FF7D44', // "Book Consultation" & "Add to Cart"
          light: '#FFF2EC',
        },
        'ayur-beige': '#F9F7F2', // Card backgrounds
      },
      fontFamily: {
        // Inter as the primary UI font
        sans: ['Inter', 'system-ui', 'Arial', 'sans-serif'],
        // DM Serif Display for marketing/section headings
        serif: ['DM Serif Display', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}