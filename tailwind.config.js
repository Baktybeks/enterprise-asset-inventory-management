/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#5B67CA",
        "primary-dark": "#475AD7",
        secondary: "#151312",
        background: "#F5F7FA",
        card: "#FFFFFF",
        text: "#333333",
        "text-secondary": "#6B7280",
        border: "#E0E7FF",
      },
      fontFamily: {
        sans: ["Inter_400Regular"],
        medium: ["Inter_500Medium"],
        semibold: ["Inter_600SemiBold"],
        bold: ["Inter_700Bold"],
      },
    },
  },
  plugins: [],
};
