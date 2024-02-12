/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {

      colors: {
        'custom-black': '#000000',
        'custom-orange': '#f24822',
        'custom-yellow': '#ffa629',
        'custom-light-yellow': '#ffcd29',
        'custom-green': '#14ae5c',
        'custom-blue': '#0d99ff',
        'custom-purple': '#9747ff',
      },
      ringColor: theme => ({
        DEFAULT: theme('colors.blue.500'), // Default ring color
        ...theme('colors.custom'), // Spread custom colors under the ringColor theme
      }),
      fontFamily: {
        'great-vibes': ['Great Vibes', 'sans-serif'],
        'oswald': ['Oswald', 'sans-serif'],
      },
    },
  },
  plugins: [],
}