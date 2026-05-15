import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./sections/**/*.{js,ts,jsx,tsx,mdx}",
    "./hooks/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: "#050505",
        graphite: "#1A1A1A",
        champagne: "#D6BE8A",
        gold: "#C6A769",
        "gold-light": "#E8D5A3",
        "warm-white": "#F7F4EF",
        "warm-white-dim": "#EDE9E1",
        "glass-white": "rgba(247, 244, 239, 0.05)",
        "glass-border": "rgba(214, 190, 138, 0.15)",
        "glass-border-hover": "rgba(214, 190, 138, 0.35)",
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      fontSize: {
        "2xs": ["0.625rem", { lineHeight: "1rem", letterSpacing: "0.15em" }],
        "3xl": ["1.875rem", { lineHeight: "2.25rem", letterSpacing: "-0.02em" }],
        "4xl": ["2.25rem", { lineHeight: "2.5rem", letterSpacing: "-0.03em" }],
        "5xl": ["3rem", { lineHeight: "1", letterSpacing: "-0.04em" }],
        "6xl": ["3.75rem", { lineHeight: "1", letterSpacing: "-0.04em" }],
        "7xl": ["4.5rem", { lineHeight: "1", letterSpacing: "-0.04em" }],
        "8xl": ["6rem", { lineHeight: "1", letterSpacing: "-0.05em" }],
        "9xl": ["8rem", { lineHeight: "1", letterSpacing: "-0.05em" }],
      },
      letterSpacing: {
        widest: "0.2em",
        "ultra-wide": "0.35em",
        elegant: "0.12em",
      },
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
        "30": "7.5rem",
        "34": "8.5rem",
        "38": "9.5rem",
        "42": "10.5rem",
        "50": "12.5rem",
        "54": "13.5rem",
        "58": "14.5rem",
        "62": "15.5rem",
        "66": "16.5rem",
        "70": "17.5rem",
        "76": "19rem",
        "84": "21rem",
        "88": "22rem",
        "92": "23rem",
        "96": "24rem",
        "100": "25rem",
        "108": "27rem",
        "112": "28rem",
        "120": "30rem",
        "128": "32rem",
        "144": "36rem",
        "160": "40rem",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "gradient-champagne":
          "linear-gradient(135deg, #D6BE8A 0%, #C6A769 50%, #D6BE8A 100%)",
        "gradient-obsidian":
          "linear-gradient(180deg, #050505 0%, #1A1A1A 100%)",
        "gradient-luxury":
          "linear-gradient(135deg, #050505 0%, #1A1A1A 40%, #0D0D0D 100%)",
      },
      backdropBlur: {
        xs: "2px",
      },
      animation: {
        "grain": "grain 8s steps(10) infinite",
        "float": "float 6s ease-in-out infinite",
        "glow-pulse": "glowPulse 3s ease-in-out infinite",
        "shimmer": "shimmer 2.5s linear infinite",
        "text-reveal": "textReveal 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "fade-up": "fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "scale-in": "scaleIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "draw": "draw 2s ease forwards",
      },
      keyframes: {
        grain: {
          "0%, 100%": { transform: "translate(0, 0)" },
          "10%": { transform: "translate(-5%, -10%)" },
          "20%": { transform: "translate(-15%, 5%)" },
          "30%": { transform: "translate(7%, -25%)" },
          "40%": { transform: "translate(-5%, 25%)" },
          "50%": { transform: "translate(-15%, 10%)" },
          "60%": { transform: "translate(15%, 0%)" },
          "70%": { transform: "translate(0%, 15%)" },
          "80%": { transform: "translate(3%, 35%)" },
          "90%": { transform: "translate(-10%, 10%)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        glowPulse: {
          "0%, 100%": {
            boxShadow: "0 0 20px rgba(214, 190, 138, 0.1)",
          },
          "50%": {
            boxShadow: "0 0 60px rgba(214, 190, 138, 0.3)",
          },
        },
        shimmer: {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },
        textReveal: {
          "0%": { clipPath: "inset(0 100% 0 0)" },
          "100%": { clipPath: "inset(0 0% 0 0)" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        draw: {
          "0%": { strokeDashoffset: "1000" },
          "100%": { strokeDashoffset: "0" },
        },
      },
      transitionTimingFunction: {
        "premium": "cubic-bezier(0.16, 1, 0.3, 1)",
        "cinematic": "cubic-bezier(0.76, 0, 0.24, 1)",
        "elastic": "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
      },
      transitionDuration: {
        "400": "400ms",
        "600": "600ms",
        "800": "800ms",
        "1000": "1000ms",
        "1200": "1200ms",
      },
      zIndex: {
        "60": "60",
        "70": "70",
        "80": "80",
        "90": "90",
        "100": "100",
      },
      boxShadow: {
        "champagne": "0 0 40px rgba(214, 190, 138, 0.15)",
        "champagne-hover": "0 0 80px rgba(214, 190, 138, 0.25)",
        "glass": "0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
        "glow-gold": "0 0 60px rgba(198, 167, 105, 0.3)",
        "inset-gold": "inset 0 1px 0 rgba(214, 190, 138, 0.2)",
        "premium": "0 20px 60px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(214, 190, 138, 0.1)",
        "premium-hover": "0 30px 80px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(214, 190, 138, 0.25)",
      },
    },
  },
  plugins: [],
};

export default config;
