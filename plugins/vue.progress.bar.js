import VueProgressBar from "@aacassandra/vue3-progressbar";
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(VueProgressBar, {
    color: "rgb(107, 114, 128)",
    failedColor: "red",
    thickness: "5px",
    position: "relative",
  });
  return {
    provide: {
      progress: nuxtApp.vueApp.config.globalProperties.$Progress,
    },
  };
});
