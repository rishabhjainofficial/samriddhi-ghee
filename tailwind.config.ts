import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      aspectRatio: {
        "4/3": "4 / 3",
        "4/5": "4 / 5",
      },
      colors: {
        primary: {
          DEFAULT: "#7C2D12", // Earthy Terracotta Brown (Rosier signature)
          dark: "#5E1F09",
          light: "#9A3412",
        },
        terracotta: {
          DEFAULT: "#7C2D12",
          light: "#9A3412",
          dark: "#5A1B07",
          50: "#FFF7ED",
          100: "#FFEDD5",
          800: "#9A3412",
          900: "#7C2D12",
          950: "#431407",
        },
        amber: {
          DEFAULT: "#D97706",
          dark: "#B45309",
          light: "#F59E0B",
          gold: "#E0981E",
        },
        forest: {
          DEFAULT: "#1B4332",
          dark: "#0F281E",
          light: "#2D6A4F",
        },
        organic: {
          DEFAULT: "#059669",
          dark: "#047857",
          light: "#10B981",
        },
        cream: {
          DEFAULT: "#FAF6EE", // Warm Rosier Ivory
          light: "#FDFBF7",
          dark: "#F3ECE0",
          50: "#FCF9F2",
          100: "#FAF6EE",
          200: "#F3ECE0",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "Cambria", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
