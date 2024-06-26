import { defineStore } from "pinia";
import { ref } from "vue";
import { Corpus } from "~/lib/model/corpus";
import { OrbisApiService } from "~/lib/services/orbisApiService";
import { AnnotationType } from "~/lib/model/annotationType";

export const useCorpusStore = defineStore("corpus", () => {
  const runtimeConfig = useRuntimeConfig();
  const orbisApiService = new OrbisApiService(
    runtimeConfig.public.orbisBaseUrl,
  );
  const corpora = ref([] as Corpus[]);
  const corpus = ref({} as Corpus);
  const annotationTypes = ref([] as AnnotationType[]);

  function reset() {
    corpora.value = [] as Corpus[];
    corpus.value = {} as Corpus;
    annotationTypes.value = [] as AnnotationType[];
  }

  async function loadCorpora() {
    try {
      const response = await orbisApiService.getCorpora();

      if (Array.isArray(response) && response.length > 0) {
        corpora.value = response;
      }
    } catch (error) {
      throw new Error("An error occurred while fetching corpora.", {
        cause: error,
      });
    }
  }

  async function deleteCorpus(corpusToDelete: Corpus) {
    try {
      await orbisApiService.deleteCorpus(corpusToDelete);
      corpora.value = corpora.value.filter(
        (corpus) => corpus.identifier !== corpusToDelete.identifier,
      );
    } catch (error) {
      throw new Error("An error occurred while deleting a corpus", {
        cause: error,
      });
    }
  }

  async function loadCorpus(corpusId: number) {
    try {
      corpus.value = await orbisApiService.getCorpus(corpusId);
    } catch (error) {
      throw new Error("An error occurred while fetching a corpus.");
    }
  }

  async function createCorpus(corpusName: string, chosenFile: File) {
    try {
      let newCorpus: Corpus = new Corpus({
        name: corpusName,
        supportedAnnotationTypes: [],
      });
      newCorpus = await orbisApiService.createCorpus(newCorpus, chosenFile);
      corpora.value.push(newCorpus);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async function loadAnnotationTypes(identifier: number | undefined) {
    try {
      if (!identifier) {
        throw new Error(
          "Corpus identifier is required to load annotation types.",
        );
      }
      annotationTypes.value =
        await orbisApiService.getAnnotationTypes(identifier);
    } catch (error) {
      throw new Error("An error occurred while fetching annotation types.");
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
    annotationTypes,
    loadAnnotationTypes,
  };
});
