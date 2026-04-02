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
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "var(--primary-color, #8b5cf6)",
        accent: "var(--accent-color, #6d28d9)",
        card: "var(--card-bg, #1f2937)",
        cardBorder: "var(--card-border, #374151)",
      },
    },
  },
  plugins: [],
};
export default config;
