import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Superfícies — mapeadas para CSS vars
        "bg-base":   "var(--bg-base)",
        "bg-canvas": "var(--bg-canvas)",
        "elev-1":    "var(--bg-elev-1)",
        "elev-2":    "var(--bg-elev-2)",
        "elev-3":    "var(--bg-elev-3)",

        // Neon — seção 4.1
        neon: {
          cyan:    "#2ce9ff",
          violet:  "#8a5cff",
          magenta: "#ff3df2",
          green:   "#4fffa6",
          amber:   "#ffd166",
          blue:    "#356bff",
        },

        // Produtos
        pdt: {
          vigia:   "#2ce9ff",
          wifacil: "#4fffa6",
          atendai: "#a685ff",
          pixel:   "#ffd166",
          encarte: "#ff5bb8",
        },

        // Semântico
        success: "#4fffa6",
        warning: "#ffb547",
        danger:  "#ff5e6c",
        info:    "#6cb8ff",

        // Legacy (manter enquanto telas antigas existirem)
        ink:   "#07090f",
        panel: "#0a0d16",
      },

      fontFamily: {
        sans:  ["var(--font-sans)", "Arial", "Helvetica", "sans-serif"],
        mono:  ["var(--font-mono)", "monospace"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
      },

      borderRadius: {
        pill: "999px",
      },

      boxShadow: {
        card:   "0 4px 24px rgba(0,0,0,0.28), 0 1px 0 rgba(255,255,255,0.08)",
        neon:   "0 0 28px rgba(44, 233, 255, 0.18)",
        violet: "0 0 34px rgba(138, 92, 255, 0.2)",
        modal:  "0 30px 110px rgba(0,0,0,0.56), 0 0 0 1px rgba(44,233,255,0.06)",
      },
    },
  },
  plugins: [],
};

export default config;
