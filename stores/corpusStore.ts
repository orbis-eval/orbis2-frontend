import { defineStore } from "pinia";
import { ref } from "vue";
import { OrbisApiService } from "~/lib/orbisApi/orbisApiService";
import { Corpus } from "~/lib/model/corpus";
import { Error } from "~/lib/model/error";
import { Document } from "~/lib/model/document";
import { DocumentFileReader } from "~/lib/utils/documentFileReader";

export const useCorpusStore = defineStore("corpus", () => {
  const corpora = ref([] as Corpus[]);
  const corpus = ref({} as Corpus);

  function reset() {
    corpora.value = [] as Corpus[];
    corpus.value = {} as Corpus;
  }

  async function loadCorpora(orbisApiService: OrbisApiService) {
    try {
      const response = await orbisApiService.getCorpora();

      if (response instanceof Error) {
        return new Error("Something is wrong with the response");
      }

      if (Array.isArray(response) && response.length > 0) {
        corpora.value = response;
      }
    } catch (error) {
      return new Error("An error occurred while fetching corpora.");
    }
  }

  async function deleteCorpus(
    corpusToDelete: Corpus,
    orbisApiService: OrbisApiService,
  ) {
    try {
      await orbisApiService.deleteCorpus(corpusToDelete);
      corpora.value = corpora.value.filter(
        (corpus) => corpus.id !== corpusToDelete.id,
      );
    } catch (error) {
      return new Error("An error occurred while deleting a corpus");
    }
  }

  async function loadCorpus(
    corpusId: number,
    orbisApiService: OrbisApiService,
  ) {
    try {
      const loadedCorpus = await orbisApiService.getCorpus(corpusId);

      if (loadedCorpus instanceof Corpus) {
        corpus.value = loadedCorpus;
      }
    } catch (error) {
      return new Error("An error occurred while fetching a corpus.");
    }
  }

  async function createCorpus(
    corpusName: string,
    chosenFiles: File[],
    orbisApiService: OrbisApiService,
  ) {
    try {
      let newCorpus: Corpus | Error = new Corpus({
        name: corpusName,
        supportedAnnotationTypes: [],
      });
      let docs: Document[] = [];
      if (chosenFiles.length > 0) {
        docs = await DocumentFileReader.readFiles(chosenFiles);
      }
      newCorpus = await orbisApiService.createCorpus(newCorpus, docs);
      if (newCorpus instanceof Corpus) {
        corpora.value.push(newCorpus);
      } else {
        return new Error("An error occurred while adding a new corpus");
      }
    } catch (error) {
      return new Error("An error occurred while adding a new corpus");
    }
  }

  return {
    corpora,
    corpus,
    reset,
    loadCorpora,
    deleteCorpus,
    loadCorpus,
    createCorpus,
  };
});
