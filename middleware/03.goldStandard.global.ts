import { useRunStore } from "~/stores/runStore";
import { useDocumentStore } from "~/stores/documentStore";
import { useAnnotationStore } from "~/stores/annotationStore";

export default defineNuxtRouteMiddleware(async (to) => {
  const runStore = useRunStore();
  const documentStore = useDocumentStore();
  const annotationStore = useAnnotationStore();
  const goldStandardId = Number.parseInt(to.params.goldStandardId?.toString());

  // fetch the gold standard if it's not already loaded
  if (
    goldStandardId &&
    goldStandardId !== runStore.selectedGoldStandard.identifier
  ) {
    documentStore.reset();
    annotationStore.reset();
    const goldStandard = await runStore.getGoldStandardById(goldStandardId);
    if (!goldStandard) {
      throw new Error("Gold standard not found");
    }
    runStore.changeSelectedGoldStandard(goldStandard);
  }
});
