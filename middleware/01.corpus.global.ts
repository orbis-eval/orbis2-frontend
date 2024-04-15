import { useCorpusStore } from "~/stores/corpusStore";
import { useRunStore } from "~/stores/runStore";

export default defineNuxtRouteMiddleware(async (to) => {
  const corpusStore = useCorpusStore();
  const runStore = useRunStore();

  const corpusId = Number.parseInt(to.params.corpusId?.toString());

  // fetch the corpus if it's not already loaded
  if (corpusId && corpusId !== corpusStore.corpus.identifier) {
    await corpusStore.loadCorpus(corpusId).then(async () => {
      // load gold standards and select default gold standard
      await runStore.loadGoldStandards(corpusId);
      if (runStore.goldStandards.length > 0) {
        runStore.selectedGoldStandard = runStore.goldStandards[0];
      } else {
        // raise error
        Error("No gold standards found for corpus");
      }

      // load runs
      await runStore.loadRuns(corpusId);
    });
  }
});
