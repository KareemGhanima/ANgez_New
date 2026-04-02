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
        "brand-black": "#010816",
        "brand-dark": "#0D1117",
        "neon-cyan": "#00FFFF",
        "neon-green": "#39FF14",
        "neon-gold": "#FFD700",
      },
      boxShadow: {
        "neon-cyan": "0 0 15px -3px rgba(0, 255, 255, 0.4)",
        "neon-gold": "0 0 15px -3px rgba(255, 215, 0, 0.4)",
        "holo": "0 8px 32px 0 rgba(0, 255, 255, 0.15)",
        "shield": "inset 0 0 20px rgba(255, 215, 0, 0.2), 0 0 15px rgba(255, 215, 0, 0.4)",
      }
    },
  },
  plugins: [],
};
export default config;
