module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  parser: "vue-eslint-parser",
  parserOptions: {
    parser: "@typescript-eslint/parser",
  },
  extends: [
    "@nuxtjs/eslint-config-typescript",
    "plugin:vue/vue3-recommended",
    "prettier",
    "plugin:prettier/recommended"
  ],
  plugins: ["simple-import-sort"],
  // plugins: [],
  rules: {},
};
