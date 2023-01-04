// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    modules: [
        "@nuxtjs/tailwindcss"
    ],
    tailwindcss: {
        // add '~tailwind.config` alias
        exposeConfig: true
    },
    app: {
        head: {
            meta: [
                {name: 'viewport', content: 'width=device-width, initial-scale=1'}
            ],
            bodyAttrs: {
                class: 'h-full'
            },
            htmlAttrs: {
                class: 'h-full bg-gray-100'
            }
        }
    },
    css: [
        '@/assets/css/main.scss'
    ],
    runtimeConfig: {
        public: {
            orbisApiBase: 'http://localhost:63019/'
        }
    }
})
