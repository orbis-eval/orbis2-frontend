// plugins/vuetify.js
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import colors from 'vuetify/lib/util/colors'

export default defineNuxtPlugin(nuxtApp => {
    const vuetify = createVuetify({
        components,
        directives,
        theme: {
            themes: {
                light: {
                    dark: true,
                    colors: {
                        primary: colors.orange.lighten4,
                        primaryLight: "#ffffe4",
                        primaryDark: "#cbae82",
                        primaryText: colors.shades.black,
                        secondary: colors.lightGreen.lighten4,
                        secondaryLight: "#fffffb",
                        secondaryDark:"#aabb97",
                        secondaryText: colors.shades.black,
                    }
                }
            }
        }
    })

    nuxtApp.vueApp.use(vuetify)
})