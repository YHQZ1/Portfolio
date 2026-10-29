export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["Raleway", "system-ui", "sans-serif"],
      },

      colors: {
        light: {
          primary: "#f8fafc",
          secondary: "#ffffff",
          accent: "#0f172a",
          muted: "#64748b",
          border: "#e2e8f0",
        },
        dark: {
          primary: "#1a1a1a",
          secondary: "#242424",
          accent: "#f8fafc",
          muted: "#94a3b8",
          border: "#374151",
        },
      },
    },
  },
  plugins: [],
};
