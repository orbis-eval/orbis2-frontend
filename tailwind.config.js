/* eslint-disable @typescript-eslint/naming-convention */
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
          "base-100": "#374151",
          info: "#3abff8",
          success: "#36d399",
          warning: "#fbbd23",
          error: "#f87272",
        },
      },
      "light",
    ],
  },
  darkMode: "class",
};
