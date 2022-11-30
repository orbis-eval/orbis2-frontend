// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss'],
  app: {
    head: {
      meta: [
        // <meta name="viewport" content="width=device-width, initial-scale=1">
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ],
      bodyAttrs: {
        class: 'h-full' // for tailwind template
      },
      htmlAttrs: {
        class: 'h-full bg-gray-100' // for tailwind template
      }
    }
  }
})
