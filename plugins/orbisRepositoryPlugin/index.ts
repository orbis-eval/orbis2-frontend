import {OrbisRepositoryService} from "~/plugins/orbisRepositoryPlugin/orbis.repository.service";

export default defineNuxtPlugin((nuxtApp) => {
    const runtimeConfig = useRuntimeConfig()
    const orbisRepositoryService = new OrbisRepositoryService(runtimeConfig.orbisApiBase)
    return {
        provide: {
            orbisRepositoryService: orbisRepositoryService
        }
    }
})
