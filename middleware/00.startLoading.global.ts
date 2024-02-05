export default defineNuxtRouteMiddleware(async (to, from) => {
  const { $progress } = useNuxtApp();
  // @ts-ignore
  $progress.start();
});
