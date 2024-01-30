import { useCorpusStore } from "~/stores/corpusStore";
import { useRunStore } from "~/stores/runStore";

export default defineNuxtRouteMiddleware((to, from) => {
  const corpusStore = useCorpusStore();
  const runStore = useRunStore();

  // check if route to has a runId param
  if (to.params.corpusId !== corpusStore.corpus.identifier) {
    // if it does, set the runId in the store
    runStore.loadGoldStandards(to.params.corpusId).then(() => {
      runStore.selectedGoldStandard = runStore.goldStandards[0];
    });
  }

});