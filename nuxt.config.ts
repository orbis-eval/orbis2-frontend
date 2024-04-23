// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    "@nuxtjs/tailwindcss",
    "@pinia/nuxt",
    "@nuxtjs/i18n",
    "@nuxtjs/color-mode",
  ],
  plugins: ["~/plugins/vue.progress.bar.ts"],
  build: {
    transpile: ["oh-vue-icons"],
  },
  typescript: {
    typeCheck: true,
  },
  tailwindcss: {
    // add '~tailwind.config` alias
    exposeConfig: true,
  },
  app: {
    head: {
      meta: [
        { name: "viewport", content: "width=device-width, initial-scale=1" },
      ],
      bodyAttrs: {
        class: "h-full",
      },
      htmlAttrs: {
        class: "h-full",
      },
      link: [
        {
          rel: "icon",
          type: "image/x-icon",
          href: "/favicon.ico",
        },
      ],
    },
  },
  css: ["@/assets/css/main.scss"],
  runtimeConfig: {
    public: {
      orbisApiBase: "http://localhost:63012/",
      orbisBaseUrl: "http://localhost:63012",
    },
  },
  pinia: {
    autoImports: [
      // automatically imports `defineStore`
      "defineStore", // import { defineStore } from 'pinia'
      "storeToRefs", // import { storeToRefs } from 'pinia'
    ],
  },
  ssr: false,
  devServer: {
    host: "0.0.0.0",
  },
  colorMode: {
    preference: "dark",
    dataValue: "theme",
    classSuffix: "",
  },
});
