/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#0C0F14",
        surface: "#151922",
        text: "#E5E8EF",
        accent: "#2A9DF4",
        border: "#1F2531"
      }
    }
  },
  plugins: []
};
