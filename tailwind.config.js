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
          "base-200": "#333b47",
          "base-300": "#22272f",
          info: "#3abff8",
          success: "#36d399",
          warning: "#fbbd23",
          error: "#f87272",
        },
      },
      {
        light: {
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          ...require("daisyui/src/theming/themes").light,
          "base-100": "#edeff2",
          "base-200": "#dfe2e6",
          "base-300": "#d1d5db",
        },
      },
    ],
  },
  darkMode: "class",
};
