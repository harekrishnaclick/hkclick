import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        chart: {
          "1": "var(--chart-1)",
          "2": "var(--chart-2)",
          "3": "var(--chart-3)",
          "4": "var(--chart-4)",
          "5": "var(--chart-5)",
        },
        sidebar: {
          DEFAULT: "var(--sidebar-background)",
          foreground: "var(--sidebar-foreground)",
          primary: "var(--sidebar-primary)",
          "primary-foreground": "var(--sidebar-primary-foreground)",
          accent: "var(--sidebar-accent)",
          "accent-foreground": "var(--sidebar-accent-foreground)",
          border: "var(--sidebar-border)",
          ring: "var(--sidebar-ring)",
        },
        'cosmic-purple': 'var(--cosmic-purple)',
        'cosmic-blue': 'var(--cosmic-blue)',
        'mystic-purple': 'var(--mystic-purple)',
        'golden': 'var(--golden)',
        'deep-space': 'var(--deep-space)',
        'surface': '#0d1228',
        'surface-bright': '#333850',
        'surface-container': '#191e35',
        'surface-container-high': '#242940',
        'surface-container-highest': '#2f334b',
        'surface-container-low': '#151a31',
        'surface-container-lowest': '#080d22',
        'surface-variant': '#2f334b',
        'surface-dim': '#0d1228',
        'on-surface': '#dde1ff',
        'on-surface-variant': '#d0c6ab',
        'primary-container': '#ffd700',
        'on-primary': '#3a3000',
        'on-primary-container': '#705e00',
        'primary-fixed': '#ffe16d',
        'primary-fixed-dim': '#e9c400',
        'secondary-container': '#7701d0',
        'on-secondary': '#480081',
        'on-secondary-container': '#dcb7ff',
        'inverse-surface': '#dde1ff',
        'outline': '#999077',
        'outline-variant': '#4d4732',
        'tertiary': '#e5faff',
        'tertiary-container': '#72ebff',
        'tertiary-fixed-dim': '#00daf3',
        'secondary-fixed-dim': '#dcb8ff',
      },
      fontFamily: {
        sans: ["'Inter'", "sans-serif"],
        serif: ["Georgia", "serif"],
        mono: ["'Space Grotesk'", "sans-serif"],
        sora: ["'Sora'", "sans-serif"],
        inter: ["'Inter'", "sans-serif"],
        orbitron: ["'Space Grotesk'", "sans-serif"],
        'space-grotesk': ["'Space Grotesk'", "sans-serif"],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        twinkle: {
          '0%': { opacity: '0.3' },
          '100%': { opacity: '1' }
        },
        'button-press': {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(0.95)' },
          '100%': { transform: 'scale(1)' }
        },
        'score-increase': {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)' }
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(255,215,0,0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(255,215,0,0.7)' },
        },
        indicatorBlink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.3' },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        float: "float 3s ease-in-out infinite",
        twinkle: "twinkle 2s ease-in-out infinite alternate",
        'pulse-slow': "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        'button-press': "button-press 0.1s ease-in-out",
        'score-increase': "score-increase 0.3s ease-in-out",
        'glow-pulse': "glow-pulse 2s ease-in-out infinite",
        'indicator-blink': "indicatorBlink 2.5s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;
