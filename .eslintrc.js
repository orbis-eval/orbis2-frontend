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
  extends: [
    "@nuxtjs/eslint-config-typescript",
    "plugin:prettier/recommended",
    "plugin:@intlify/vue-i18n/recommended",
  ],
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
    "@intlify/vue-i18n/no-missing-keys": "error",
    "@intlify/vue-i18n/no-raw-text": "off",
    "@intlify/vue-i18n/no-missing-keys-in-other-locales": "error",
    "@intlify/vue-i18n/no-duplicate-keys-in-locale": "error",
  },
  overrides: [
    {
      files: ["locales/*.json"],
      rules: {
        "no-unused-expressions": "off",
        "@intlify/vue-i18n/no-missing-keys-in-other-locales": "error",
        "@intlify/vue-i18n/no-duplicate-keys-in-locale": "error",
      },
    },
  ],
  settings: {
    "vue-i18n": {
      localeDir: "./locales/*.{json, yaml, yml}",
      messageSyntaxVersion: "^9.0.0",
    },
  },
};
