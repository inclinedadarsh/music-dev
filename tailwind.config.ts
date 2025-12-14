import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        background: "#F5F3EF",
        foreground: "#2C2C2C",
        primary: {
          DEFAULT: "#8B7EC8",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#E5E3DE",
          foreground: "#2C2C2C",
        },
        card: {
          DEFAULT: "#FFFFFF",
          foreground: "#2C2C2C",
        },
        border: "#E5E3DE",
        muted: {
          DEFAULT: "#F5F3EF",
          foreground: "#6B7280",
        },
        accent: {
          DEFAULT: "#F5F3EF",
          foreground: "#2C2C2C",
        },
        destructive: {
          DEFAULT: "#EF4444",
          foreground: "#FFFFFF",
        },
      },
      borderRadius: {
        lg: "12px",
        md: "8px",
        sm: "6px",
      },
      boxShadow: {
        card: "0 2px 8px rgba(0, 0, 0, 0.08)",
      },
    },
  },
  plugins: [],
} satisfies Config

export default config

