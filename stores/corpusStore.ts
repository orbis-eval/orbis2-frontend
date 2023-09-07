import {defineStore} from "pinia";
import {OrbisApiService} from "~/lib/orbisApi/orbisApiService";
import {Corpus} from "~/lib/model/corpus";
import {Error} from "~/lib/model/error";
import {ref} from 'vue';
import {Document} from "~/lib/model/document";
import {ApiUtils} from "~/lib/utils/apiUtils";

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

    async function deleteCorpora(corpusToDelete: Corpus, orbisApiService: OrbisApiService) {
        try {
            await orbisApiService.removeCorpus(corpusToDelete);
            corpora.value = corpora.value.filter(corpus => corpus._id !== corpusToDelete._id);
        } catch (error) {
            return new Error("An error occurred while deleting a corpus");
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

    async function addCorpus(corpusName: string, chosenFiles: File[], orbisApiService: OrbisApiService) {
        try {
            let newCorpus: Corpus | Error = new Corpus({
                "name": corpusName,
                "supported_annotation_types": []
            })
            if (chosenFiles.length == 0) {
                newCorpus = await ApiUtils.addCorpus(newCorpus, [], orbisApiService);
            } else {
                newCorpus = await ApiUtils.readAndStoreDocuments(chosenFiles, newCorpus, orbisApiService);
            }
            if (newCorpus instanceof Corpus) {
                corpora.value.push(newCorpus)
            } else {
                return new Error("An error occurred while adding a new corpus");
            }
        } catch (error) {
            return new Error("An error occurred while adding a new corpus");
        }
    }

    return {corpora, corpus, reset, loadCorpora, deleteCorpora, loadCorpus, addCorpus};
});
