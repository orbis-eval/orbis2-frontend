import { useGoldStandardStore } from "~/stores/goldStandardStore";
import { useDocumentStore } from "~/stores/documentStore";
import { useAnnotationStore } from "~/stores/annotationStore";

export default defineNuxtRouteMiddleware(async (to) => {
  const goldStandardStore = useGoldStandardStore();
  const documentStore = useDocumentStore();
  const annotationStore = useAnnotationStore();
  const goldStandardId = Number.parseInt(to.params.goldStandardId?.toString());

  // fetch the gold standard if it's not already loaded
  if (
    goldStandardId &&
    goldStandardId !== goldStandardStore.selectedGoldStandard.identifier
  ) {
    documentStore.reset();
    annotationStore.reset();
    const goldStandard = goldStandardStore.getGoldStandardById(goldStandardId);
    if (!goldStandard) {
      throw new Error("Gold standard not found");
    }
    await goldStandardStore.changeSelectedGoldStandard(goldStandard);
  }
});
