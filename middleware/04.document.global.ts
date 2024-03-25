import { useCorpusStore } from "~/stores/corpusStore";
import { useDocumentStore } from "~/stores/documentStore";
import { useAnnotationStore } from "~/stores/annotationStore";
import { useColorPalettesStore } from "~/stores/colorPalettesStore";

export default defineNuxtRouteMiddleware(async (to) => {
  const corpusStore = useCorpusStore();
  const documentStore = useDocumentStore();
  const annotationStore = useAnnotationStore();
  const colorPalettesStore = useColorPalettesStore();
  const { $progress } = useNuxtApp();

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
    // @ts-ignore
    $progress.increase(10);
    await documentStore.loadDocument(documentId).then(async () => {
      // @ts-ignore
      $progress.increase(10);
      if (documentStore.currentDocument.identifier && idOfRun) {
        // load color palette
        await colorPalettesStore.loadColorPalettes();
        // @ts-ignore
        $progress.increase(10);
        // load annotations
        await annotationStore.loadAnnotations(
          documentStore.currentDocument.identifier,
          documentStore.currentDocument.content,
          idOfRun,
          corpusStore.corpus.supportedAnnotationTypes,
        );
        // @ts-ignore
        $progress.increase(10);
      }
    });
  }
});
