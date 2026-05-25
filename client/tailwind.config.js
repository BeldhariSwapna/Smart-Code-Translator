/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        accent: { DEFAULT: "#c084fc", hover: "#a855f7", light: "rgba(192,132,252,0.15)" },
        dark: { bg: "#0f0f13", card: "#1a1b23", border: "#2e303a" },
      },
      fontFamily: {
        mono: ["ui-monospace", "Consolas", "monospace"],
      },
    },
  },
  plugins: [],
};

