import { defineStore } from "pinia";
import { OrbisApiService } from "~/lib/orbisApi/orbisApiService";
import { Corpus } from "~/lib/model/corpus";
import { Error } from "~/lib/model/error";
import { ref } from 'vue';

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

    async function loadCorpus(corpusId: number, orbisApiService: OrbisApiService) {
        try {
            const loadedCorpus = await orbisApiService.getCorpus(corpusId);

            if (loadedCorpus instanceof Corpus) {
                corpus.value = loadedCorpus;
            }
        } catch (error) {
            return new Error("An error occurred while fetching a corpus.");
        }
    }

    // TODO: Implement the removeCorpus action if needed

    return { corpora, corpus, reset, loadCorpora, loadCorpus };
});
