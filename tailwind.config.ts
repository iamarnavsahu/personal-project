import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0e0e10",
        paper: "#fafaf7",
        mute: "#6b6b6b",
        line: "#1a1a1c"
      },
      fontFamily: {
        sans: ["ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
        serif: ["ui-serif", "Georgia", "Cambria", "Times New Roman", "serif"]
      },
      letterSpacing: {
        tightest: "-0.04em"
      }
    }
  },
  plugins: []
} satisfies Config;
