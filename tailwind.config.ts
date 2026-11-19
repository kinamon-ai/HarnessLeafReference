import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        canvas: {
          bg: "#080c14",
          grid: "#111b2b",
          panel: "#0d1527",
          border: "#1e2c45",
          highlight: "#22395d",
        },
        socket: {
          cyan: "#00E5FF",
          blue: "#2979FF",
          purple: "#D500F9",
          yellow: "#FFEA00",
          orange: "#FF9100",
          green: "#00E676",
          pink: "#FF4081",
          red: "#FF1744",
          white: "#ECEFF1",
        },
      },
      boxShadow: {
        "glow-cyan": "0 0 15px rgba(0, 229, 255, 0.4)",
        "glow-purple": "0 0 15px rgba(213, 0, 249, 0.4)",
        "glow-yellow": "0 0 15px rgba(255, 234, 0, 0.4)",
        "glow-green": "0 0 15px rgba(0, 230, 118, 0.4)",
        "glow-pink": "0 0 15px rgba(255, 64, 129, 0.4)",
        "glow-orange": "0 0 15px rgba(255, 145, 0, 0.4)",
      },
    },
  },
  plugins: [],
} satisfies Config;
