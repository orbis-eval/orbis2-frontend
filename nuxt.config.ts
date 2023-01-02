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
            },
            style: [
                {
                    children:
                        '.layout-enter-active, .layout-leave-active { transition: all 0.4s } ' +
                        '.layout-enter-from, .layout-leave-to { filter: grayscale(1) }'
                }
            ],
        },
        pageTransition: {
            name: 'page',
            mode: 'in-out'
        },
        layoutTransition: {
            name: 'layout',
            mode: 'in-out'
        }
    }
})
