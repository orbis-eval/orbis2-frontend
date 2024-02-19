import { Progress } from "~/lib/utils/progress";

declare module '#app' {
    interface NuxtApp {
        $progress: Progress;
    }
}

declare module 'vue' {
    interface ComponentCustomProperties {
        $progress: Progress;
    }
}

export {}