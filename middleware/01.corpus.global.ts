import { useCorpusStore } from "~/stores/corpusStore";
import { useGoldStandardStore } from "~/stores/goldStandardStore";
import { useRunStore } from "~/stores/runStore";
import { useTitle } from "~/composables/title";

export default defineNuxtRouteMiddleware(async (to) => {
  const corpusStore = useCorpusStore();
  const goldStandardStore = useGoldStandardStore();
  const runStore = useRunStore();
  const { setAppTitle } = useTitle();
  const corpusId = Number.parseInt(to.params.corpusId?.toString());

  // fetch the corpus if it's not already loaded
  if (corpusId && corpusId !== corpusStore.corpus.identifier) {
    await corpusStore.loadCorpus(corpusId).then(async () => {
      // set the title
      setAppTitle(corpusStore.corpus.name);
      // load gold standards and select default gold standard
      await goldStandardStore.loadGoldStandards(corpusId);
      if (goldStandardStore.goldStandards.length > 0) {
        goldStandardStore.selectedGoldStandard =
          goldStandardStore.goldStandards[0];
      } else {
        // raise error
        Error("No gold standards found for corpus");
      }

      // load runs
      await runStore.loadRuns(corpusId);
    });
  }
});
