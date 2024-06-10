// @ts-ignore
import VueProgressBar from "@aacassandra/vue3-progressbar";
import { Progress } from "~/lib/utils/progress";

// @ts-ignore
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(VueProgressBar, {
    color: "var(--progress-bar-color)",
    failedColor: "var(--progress-bar-failed-color)",
    thickness: "7px",
    position: "relative",
  });
  return {
    provide: {
      progress: new Progress(nuxtApp.vueApp.config.globalProperties.$Progress),
    },
  };
});
