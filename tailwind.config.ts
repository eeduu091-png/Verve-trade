import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        void: "#090909",
        panel: "#141414",
        line: "#1F1F1F",
        cyan: "#00E5FF",
        success: "#00FF88",
        warning: "#FFC107",
        danger: "#FF3B30"
      },
      fontFamily: {
        sans: ["Inter", "Geist", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Geist Mono", "ui-monospace", "monospace"]
      }
    }
  },
  plugins: []
};

export default config;
