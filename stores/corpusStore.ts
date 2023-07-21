import {defineStore} from "pinia";
import {OrbisApiService} from "~/lib/orbisApi/orbisApiService";
import {Corpus} from "~/lib/model/corpus";
import {Error} from "~/lib/model/error";

export const useCorpusStore = defineStore("corpus", {
    state: () => {
        return {
            corpora: [] as Corpus[],
            corpus: {} as Corpus,
        };
    },
    actions: {
        $reset: () => {
            return {
                corpora: [] as Corpus[],
                corpus: {} as Corpus,
            };
        },
        async loadCorpora(orbisApiService: OrbisApiService) {
            try {
                const response = await orbisApiService.getCorpora();

                if (response instanceof Error) {
                    return new Error("Something is wrong with the response");
                }

                if (Array.isArray(response) && response.length > 0) {
                    this.corpora = response;
                }
            } catch (error) {
                return new Error("An error occurred while fetching corpora.");
            }
        },

        async loadCorpus(corpusId: number, orbisApiService: OrbisApiService) {
            try {
                const corpus = await orbisApiService.getCorpus(corpusId);

                if (corpus instanceof Corpus) {
                    this.corpus = corpus;
                }
            } catch (error) {
                console.error("corpusStore: error retrieving corpus")
            }
        },
        // TODO: removeCorpus action
    },
});