// FILE: frontend/tailwind.config.ts
// (This is the full code for this file)

import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";
// 1. Import the typography plugin at the top
import typography from "@tailwindcss/typography";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-lexend)", ...fontFamily.sans],
      },
      colors: {
        background: {
          primary: "rgb(var(--color-bg-primary) / <alpha-value>)",
          secondary: "rgb(var(--color-bg-secondary) / <alpha-value>)",
        },
        text: {
          primary: "rgb(var(--color-text-primary) / <alpha-value>)",
          secondary: "rgb(var(--color-text-secondary) / <alpha-value>)",
          accent: "rgb(var(--color-text-accent) / <alpha-value>)",
        },
        border: "rgb(var(--color-border) / <alpha-value>)",
      },
      backdropBlur: {
        xs: "2px",
      },
      keyframes: {
        "float-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0px)" },
        },
      },
      animation: {
        "float-in": "float-in 0.5s ease-out forwards",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
          
      },
      
    },
    // --- ADD THESE NEW SECTIONS ---
      keyframes: {
        "scroll-infinite": {
          "0%": { transform: "translateX(0)" },
          // We will use 2 copies of the list, so we move it by 50%
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        // Adjust the duration (e.g., 40s) to make it faster or slower
        "scroll-infinite": "scroll-infinite 40s linear infinite",
      },
      // --- END ADD ---
  },
  // 2. Add the imported plugin here
  plugins: [
    typography, // Use the imported variable
  ],
};
export default config;