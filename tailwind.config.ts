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
        ink: "#050816",
        panel: "#0b1020",
        neon: {
          cyan: "#2ce9ff",
          blue: "#356bff",
          violet: "#8a5cff",
          magenta: "#ff3df2",
          green: "#63ff9a",
          amber: "#ffd166",
        },
      },
      boxShadow: {
        neon: "0 0 28px rgba(44, 233, 255, 0.18)",
        violet: "0 0 34px rgba(138, 92, 255, 0.2)",
      },
    },
  },
  plugins: [],
};

export default config;
