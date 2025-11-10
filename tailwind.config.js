/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#0E1116",
        surface: "#171A21",
        text: "#E8EEF2",
        muted: "#9AA4AF",
        accent: "#2E7CF6",
        success: "#25A55F",
        danger: "#E5484D",
        border: "rgba(255,255,255,0.06)",
      },
    },
  },
  plugins: [],
};
