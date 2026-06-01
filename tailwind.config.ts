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
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "ui-serif", "Georgia", "serif"]
      },
      letterSpacing: {
        tightest: "-0.04em"
      }
    }
  },
  plugins: []
} satisfies Config;
