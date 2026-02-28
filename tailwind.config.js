/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        threat: ['Rajdhani', 'sans-serif'], // The hero section font
      },
    },
  },
  plugins: [],
}