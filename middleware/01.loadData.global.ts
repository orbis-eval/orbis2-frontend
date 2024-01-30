import { useRunStore } from "~/stores/runStore";

export default defineNuxtRouteMiddleware((to, from) => {
  const runStore = useRunStore();

  // check if route to has a runId param
  if (to.params.corpusId) {
    // if it does, set the runId in the store
    runStore.loadGoldStandards(to.params.corpusId);
  }

});