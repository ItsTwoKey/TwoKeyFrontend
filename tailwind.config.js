/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        raleway: ["Raleway", "sans"],
        tahoma: ['Tahoma', 'sans-serif'],
        familjenGrotesk: ['Familjen Grotesk', 'sans-serif'],
        allertaStencil: ['Allerta Stencil', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
        plusJakartaSans: ['Plus Jakarta Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
