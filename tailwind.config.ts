import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./contexts/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        lexi: {
          gold:        "#B8860B",
          "gold-hover":"#9A6F09",
          cream:       "#FAF5EE",
          "cream-dark":"#F0E8DB",
          border:      "#E8E0D5",
          dark:        "#1C1C1C",
          muted:       "#6B6B6B",
          brown:       "#5C3D1E",
        },
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "Georgia", "serif"],
        sans:  ["var(--font-inter)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
