import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
      colors: {
        navy: {
          50: "#F1F5FA",
          100: "#E4ECF5",
          200: "#C3D4E5",
          300: "#93AFC9",
          600: "#27547E",
          700: "#1C4266",
          800: "#14334F",
          900: "#0F2942",
          950: "#0C2136",
        },
      },
      boxShadow: {
        card: "0 1px 2px rgba(15, 36, 55, 0.04), 0 4px 12px rgba(15, 36, 55, 0.05)",
        "card-hover":
          "0 2px 4px rgba(15, 36, 55, 0.05), 0 12px 28px rgba(15, 36, 55, 0.09)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.45" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.45s cubic-bezier(0.22, 1, 0.36, 1) both",
        "pulse-soft": "pulse-soft 1.6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
