module.exports = {
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        dark: {
          primary: "#C084FC",
          secondary: "#f6d860",
          accent: "#37cdbe",
          neutral: "#111827",
          base: {
            50: "#f9fafb",
            100: "#374151",
          },
          info: "#3abff8",
          success: "#36d399",
          warning: "#fbbd23",
          error: "#f87272",
        },
        light: {
          primary: "#F3F4F6",
          secondary: "#E5E7EB",
          accent: "#2563EB",
          neutral: "#6B7280",
          base: {
            50: "#F9FAFB",
            100: "#FFFFFF",
          },
          info: "#93C5FD",
          success: "#6EE7B7",
          warning: "#FBBF24",
          error: "#EF4444",
        },
      },
    ],
  },
};
