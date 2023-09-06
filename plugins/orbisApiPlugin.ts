import {OrbisApiService} from "~/lib/orbisApi/orbisApiService";

export default defineNuxtPlugin((nuxtApp) => {
    const runtimeConfig = useRuntimeConfig();
    const orbisApiService = new OrbisApiService(runtimeConfig.public.orbisApiBase);
    return {
        provide: {
            orbisApiService: orbisApiService
        }
    };
});
