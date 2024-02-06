import VueProgressBar from "@aacassandra/vue3-progressbar";
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(VueProgressBar, {
    color: "rgb(173,216,230)",
    failedColor: "red",
    thickness: "7px",
    position: "relative",
  });
  return {
    provide: {
      progress: nuxtApp.vueApp.config.globalProperties.$Progress,
    },
  };
});
