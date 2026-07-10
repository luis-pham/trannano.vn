/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#1A100C",
          dark: "#0E0907",
          light: "#2C1C16",
        },
        accent: {
          DEFAULT: "#D4A84B",
          dark: "#B8903A",
          light: "#E8C878",
        },
        surface: {
          DEFAULT: "#FAF7F2",
          muted: "#F0EBE3",
        },
      },
      fontFamily: {
        sans: ["var(--font-be-vietnam)", "system-ui", "sans-serif"],
        display: ["var(--font-noto-serif)", "Georgia", "serif"],
      },
      boxShadow: {
        gold: "0 8px 28px rgba(212, 168, 75, 0.35)",
      },
    },
  },
  plugins: [],
};
