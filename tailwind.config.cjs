/** @type {import('tailwindcss').Config} */

const defaultTheme = require("tailwindcss/defaultTheme");
const colors = require('tailwindcss/colors');

module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter Variable", "Inter", ...defaultTheme.fontFamily.sans],
      },
    },
    screens: {
      sm: "576px",
      // => @media (min-width: 576px) { ... } - 36

      md: "768px",
      // => @media (min-width: 768px) { ... } - 48

      lg: "992px",
      // => @media (min-width: 992px) { ... } - 32

      xl: "1200px",
      // => @media (min-width: 1200px) { ... } - 60

      "2xl": "1400px",
      // => @media (min-width: 1400px) { ... } - 80
    },
  },
	plugins: [require("@tailwindcss/typography")],
}