/** @type {import('tailwindcss').Config} */

const colors = require("tailwindcss/colors") // tema de colores de Vue Tailwind Datepicker (v370)

// console.log(colors); // este console.log se ejecuta en la terminal de VScode (v370)

export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
    "./formkit.config.js",
    "./node_modules/vue-tailwind-datepicker/**/*.js", // compilamos los estilos de Vue Tailwind Datepicker (v370)
  ],
  theme: {
    extend: {
      
      colors: { // configuracion de Vue Tailwind Datepicker (v370)
        "vtd-primary": colors.indigo
      }

    },
  },
  plugins: [
    require('@tailwindcss/forms')
  ],
}