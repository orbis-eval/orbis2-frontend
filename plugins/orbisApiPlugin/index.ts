import {OrbisApiService} from "~/lib/orbisApi/orbisApiService";

export default defineNuxtPlugin((nuxtApp) => {
    const runtimeConfig = useRuntimeConfig()
    const orbisRepositoryService = new OrbisApiService(runtimeConfig.orbisApiBase)
    return {
        provide: {
            orbisRepositoryService: orbisRepositoryService
        }
    }
})
