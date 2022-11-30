// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  /*
   ** Nuxt modules
   */
  modules: [
    // https://tailwindcsss.nuxtjs.org
    "@nuxtjs/tailwindcss"
  ],
  tailwindcss: {
    // add '~tailwind.config` alias
    exposeConfig: true
  },
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
