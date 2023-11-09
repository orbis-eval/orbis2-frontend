module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  parser: "vue-eslint-parser",
  parserOptions: {
    ecmaVersion: "latest",
    parser: "@typescript-eslint/parser",
  },
  extends: ["@nuxtjs/eslint-config-typescript", "plugin:prettier/recommended"],
  plugins: ["simple-import-sort"],
  rules: {
    "no-use-before-define": "off",
    "@typescript-eslint/no-use-before-define": "error",
    "no-unused-vars": "off",
    "vue/multi-word-component-names": "off",
    "@typescript-eslint/no-unused-vars": "error",
    "prettier/prettier": "error",
    "@typescript-eslint/naming-convention": [
      "error",
      {
        selector: "variable",
        format: ["camelCase", "PascalCase", "UPPER_CASE"],
      },
      {
        selector: "property",
        format: ["camelCase", "PascalCase", "UPPER_CASE"],
      },
      {
        selector: "function",
        format: ["camelCase"],
      },
      {
        selector: "parameter",
        format: ["camelCase"],
        leadingUnderscore: "allow",
      },
      {
        selector: "typeLike",
        format: ["PascalCase"],
      },
    ],
    "vue/component-name-in-template-casing": ["error", "PascalCase"],
    "vue/no-unused-vars": "error",
    "vue/camelcase": [
      "error",
      {
        properties: "always",
        ignoreDestructuring: true,
        ignoreImports: false,
        allow: ["/^\\w+_\\d+$/"], // Custom regex to allow specific cases
      },
    ],
    "vue/valid-define-props": "error",
  },
  overrides: [],
};
