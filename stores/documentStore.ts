import {defineStore} from "pinia";
import {OrbisApiService} from "~/lib/orbisApi/orbisApiService";
import {Document} from "~/lib/model/document";

export const useDocumentStore = defineStore('document', {
    state: () => {
        return {
            documents: [] as Document[],
            nrOfDocuments: 1,
            nrOfPages: 1,
            currentSelectedDocPage: 1
        };
    },
    actions: {
        $reset() {
            this.documents = [] as Document[];
            this.nrOfDocuments = 1;
            this.nrOfPages = 1;
            this.currentSelectedDocPage = 1;
        },

        async loadDocuments(corpusId: number, orbisApiService: OrbisApiService, pageSize: number | undefined = undefined, skip: number = 0) {
            if (corpusId === undefined) {
                console.error("No corpusId provided!");
                return;
            }

            try {
                const documents = await orbisApiService.getDocuments(corpusId, pageSize, skip);

                if (Array.isArray(documents)) {
                    this.documents = documents;
                } else {
                    return new Error("The response of the documents seems invalid.");
                }

            } catch (error) {
                return new Error("An error occurred while fetching documents.");
            }
        },

        // TODO: should the number of documents come from either the current corpus or the run?
        async getNumberOfDocuments(corpusId: number, orbisApiService: OrbisApiService, pageSize: number | undefined = undefined, skip: number = 0) {
            if (corpusId === undefined) {
                console.error("No corpusId provided!");
                return;
            }

            try {
                const response = await orbisApiService.getNumberOfDocuments(corpusId, pageSize, skip);

                if (response instanceof Error) {
                    return response;
                }

                // Convert the response to a primitive number if it's of type Number
                const nrOfdocuments = response instanceof Number ? Number(response) : response;

                if (typeof nrOfdocuments === 'number') {
                    this.nrOfDocuments = nrOfdocuments;
                } else {
                    return new Error("The response of the nOfdocuments seems invalid.");
                }

            } catch (error) {
                return new Error("An error occurred while fetching documents.");
            }
        },
    }
});
