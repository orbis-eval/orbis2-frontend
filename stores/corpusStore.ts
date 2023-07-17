import {defineStore} from "pinia";
import {OrbisApiService} from "~/lib/orbisApi/orbisApiService";
import {Corpus} from "~/lib/model/corpus";

// TODO: write test for this store
export const useCorpusStore = defineStore("corpus", {
    state: () => {
        return {
            corpus: {} as Corpus,
        };
    },
    actions: {
        async getCorpus(corpusId: number, orbisApiService: OrbisApiService) {
            try {
                const corpus = await orbisApiService.getCorpus(corpusId);

                if (corpus instanceof Corpus) {
                    this.corpus = corpus;
                }
            } catch (error) {
                console.error("corpusStore: error retrieving corpus")
            }
        }
    },
});