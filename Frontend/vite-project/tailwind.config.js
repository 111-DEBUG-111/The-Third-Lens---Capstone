/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        left: "#E63946",
        right: "#1D3557",
        center: "#F1FAEE",
      },
      fontFamily: {
        inter: ["Inter", "sans-serif"],
      },
      backgroundImage: {
        "political-gradient": "linear-gradient(to right, #E63946, #F1FAEE, #1D3557)",
      },
    },
  },
  plugins: [],
};
