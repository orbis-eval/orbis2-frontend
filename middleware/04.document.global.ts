import { useCorpusStore } from "~/stores/corpusStore";
import { useDocumentStore } from "~/stores/documentStore";
import { useAnnotationStore } from "~/stores/annotationStore";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const corpusStore = useCorpusStore();
  const documentStore = useDocumentStore();
  const annotationStore = useAnnotationStore();

  const runId = Number.parseInt(to.params.runId?.toString());
  const goldStandardId = Number.parseInt(to.params.goldStandardId?.toString());
  const documentId = Number.parseInt(to.params.documentId?.toString());

  // fetch the document if it's not already loaded
  if (documentId && documentId !== documentStore.currentDocument.identifier) {
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
    await documentStore.loadDocument(documentId).then(async () => {
      if (documentStore.currentDocument.identifier && idOfRun) {
        // load annotations
        await annotationStore.loadAnnotations(
          documentStore.currentDocument.identifier,
          documentStore.currentDocument.content,
          idOfRun,
          corpusStore.corpus.supportedAnnotationTypes,
        );
      }
    });
  }
});
