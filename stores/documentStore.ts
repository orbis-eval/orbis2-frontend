import { defineStore } from "pinia";
import { ref } from "vue";
import { OrbisApiService } from "~/lib/services/orbisApiService";
import { Document } from "~/lib/model/document";
import { useColorPalettesStore } from "~/stores/colorPalettesStore";
import { useAnnotationStore } from "~/stores/annotationStore";
import { useCorpusStore } from "~/stores/corpusStore";

export const useDocumentStore = defineStore("document", () => {
  const rc = useRuntimeConfig();
  const orbisApiService = new OrbisApiService(rc.public.orbisBaseUrl);
  const documents = ref([] as Document[]);
  const currentDocument = ref({} as Document);
  const nrOfDocuments = ref(1);
  const totalPages = ref(1);
  const currentPage = ref(1);

  // Stores
  const colorPalettesStore = useColorPalettesStore();
  const annotationStore = useAnnotationStore();
  const corpusStore = useCorpusStore();

  function reset() {
    documents.value = [] as Document[];
    currentDocument.value = {} as Document;
    nrOfDocuments.value = 1;
    totalPages.value = 1;
    currentPage.value = 1;
  }

  async function loadDocuments(
    runId: number,
    pageSize: number,
    skip: number = 0,
  ) {
    try {
      documents.value = await orbisApiService.getDocuments(
        runId,
        pageSize,
        skip,
      );
    } catch (error) {
      throw new Error("An error occurred while fetching documents.", {
        cause: error,
      });
    }
  }

  async function mapDocumentWithAdditionalData(
    document: Document,
    runId: number,
  ) {
    currentDocument.value = document;
    // load color palette
    await colorPalettesStore.loadColorPalettes();
    // load annotations
    if (currentDocument.value.identifier) {
      await annotationStore.loadAnnotations(
        currentDocument.value.identifier,
        currentDocument.value.content,
        runId,
        corpusStore.corpus.supportedAnnotationTypes,
      );
    }
    return currentDocument.value;
  }

  async function loadDocument(runId: number, documentId: number) {
    try {
      return await orbisApiService
        .getDocument(runId, documentId)
        .then((document) => mapDocumentWithAdditionalData(document, runId));
    } catch (error) {
      throw new Error(
        "An error occurred while fetching document " + documentId,
        {
          cause: error,
        },
      );
    }
  }

  async function nextDocument(runId: number) {
    if (!currentDocument.value.identifier) {
      throw new Error("No valid id for current Document");
    }
    return await orbisApiService.nextDocument(
      runId,
      currentDocument.value.identifier,
    );
  }

  async function previousDocument(runId: number) {
    if (!currentDocument.value.identifier) {
      throw new Error("No valid id for current Document");
    }
    return await orbisApiService.previousDocument(
      runId,
      currentDocument.value.identifier,
    );
  }

  async function countDocuments(runId: number) {
    try {
      const response = await orbisApiService.countDocuments(runId);
      nrOfDocuments.value = Number(response);
    } catch (error) {
      throw new Error("An error occurred while fetching documents.", {
        cause: error,
      });
    }
  }

  return {
    documents,
    currentDocument,
    nrOfDocuments,
    totalPages,
    currentPage,
    reset,
    loadDocuments,
    loadDocument,
    nextDocument,
    previousDocument,
    countDocuments,
  };
});
