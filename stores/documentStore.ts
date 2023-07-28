import {defineStore} from "pinia";
import {OrbisApiService} from "~/lib/orbisApi/orbisApiService";
import {Document} from "~/lib/model/document";

export const useDocumentStore = defineStore('document', {
    state: () => {
        return {
            documents: [] as Document[],
            nrOfDocuments: 1,
            totalPages: 1,
            currentPage: 1
        };
    },
    actions: {
        $reset() {
            this.documents = [] as Document[];
            this.nrOfDocuments = 1;
            this.totalPages = 1;
            this.currentPage = 1;
        },

        async loadDocuments(
            runId: number,
            orbisApiService: OrbisApiService,
            pageSize: number,
            skip: number = 0) {
            try {
                const documents = await orbisApiService.getDocuments(
                    runId,
                    pageSize,
                    skip);
                if (Array.isArray(documents)) {
                    this.documents = documents;
                } else {
                    return new Error("The response of the documents seems invalid.");
                }
            } catch (error) {
                return new Error("An error occurred while fetching documents.");
            }
        },

        async countDocuments(runId: number, orbisApiService: OrbisApiService) {
            try {
                this.nrOfDocuments = Number(await orbisApiService.countDocuments(runId));
            } catch (error) {
                return new Error("An error occurred while fetching documents.");
            }
        },
    }
});
