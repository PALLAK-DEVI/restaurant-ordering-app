import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "#FAF7F2",
        card: "#FFFFFF",
        primary: {
          DEFAULT: "#E94B35",
          hover: "#C83B2A",
          light: "#FDF1EE",
        },
        charcoal: {
          DEFAULT: "#242424",
          light: "#4A4A4A",
          muted: "#6B7280",
        },
        edge: "#E9E5DF",
        veg: "#16834A",
        nonveg: "#DC2626",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 2px 12px -2px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.03)",
        card: "0 4px 20px -2px rgba(0, 0, 0, 0.06), 0 2px 6px -1px rgba(0, 0, 0, 0.02)",
        floating: "0 10px 30px -4px rgba(0, 0, 0, 0.12), 0 4px 12px -2px rgba(0, 0, 0, 0.06)",
      },
    },
  },
  plugins: [],
};
export default config;
