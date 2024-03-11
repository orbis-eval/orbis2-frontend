export default defineNuxtRouteMiddleware(async () => {
  const { $progress } = useNuxtApp();
  // @ts-ignore
  await $progress.start();
});
