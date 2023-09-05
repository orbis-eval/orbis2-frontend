import { defineStore } from "pinia";
import { OrbisApiService } from "~/lib/orbisApi/orbisApiService";
import { Document } from "~/lib/model/document";
import { Error } from "~/lib/model/error";
import { ref } from 'vue';

export const useDocumentStore = defineStore('document', () => {
    const documents = ref([] as Document[]);
    const nrOfDocuments = ref(1);
    const totalPages = ref(1);
    const currentPage = ref(1);

    function reset() {
        documents.value = [] as Document[];
        nrOfDocuments.value = 1;
        totalPages.value = 1;
        currentPage.value = 1;
    }

    async function loadDocuments(runId: number, orbisApiService: OrbisApiService, pageSize: number, skip: number = 0) {
        try {
            const response = await orbisApiService.getDocuments(runId, pageSize, skip);

            if (Array.isArray(response)) {
                documents.value = response;
            } else {
                return new Error("The response of the documents seems invalid.");
            }
        } catch (error) {
            return new Error("An error occurred while fetching documents.");
        }
    }

    async function countDocuments(runId: number, orbisApiService: OrbisApiService) {
        try {
            const response = await orbisApiService.countDocuments(runId);
            nrOfDocuments.value = Number(response);
        } catch (error) {
            return new Error("An error occurred while fetching documents.");
        }
    }

    return { documents, nrOfDocuments, totalPages, currentPage, reset, loadDocuments, countDocuments };
});
