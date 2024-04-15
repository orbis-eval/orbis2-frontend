import { useCorpusStore } from "~/stores/corpusStore";
import { useDocumentStore } from "~/stores/documentStore";
import { useAnnotationStore } from "~/stores/annotationStore";
import { useColorPalettesStore } from "~/stores/colorPalettesStore";

export default defineNuxtRouteMiddleware(async (to) => {
  const documentStore = useDocumentStore();

  const runId = Number.parseInt(to.params.runId?.toString());
  const goldStandardId = Number.parseInt(to.params.goldStandardId?.toString());
  const documentId = Number.parseInt(to.params.documentId?.toString());

  // fetch the document if it's not already loaded
  if (documentId) {
    let idOfRun: number;
    if (runId) {
      await documentStore.countDocuments(runId);
      idOfRun = runId;
    } else if (goldStandardId) {
      await documentStore.countDocuments(goldStandardId);
      idOfRun = goldStandardId;
    } else {
      throw new Error("No valid run or gold standard id");
    }
    await documentStore.loadDocument(idOfRun, documentId);
  }
});
