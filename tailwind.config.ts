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
          DEFAULT: "#D97706", // Ghee golden amber
          dark: "#B45309",
          light: "#FBBF24",
        },
        organic: {
          DEFAULT: "#059669", // Purity emerald
          dark: "#047857",
          light: "#10B981",
        },
        cream: {
          DEFAULT: "#FDFBF7", // Warm soft ivory canvas
          dark: "#F5EFE6",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
