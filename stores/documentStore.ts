import {defineStore} from "pinia";
import {OrbisApiService} from "~/lib/orbisApi/orbisApiService";
import {Document} from "~/lib/model/document";
import {Error} from "~/lib/model/error";
import {ref} from 'vue';

export const useDocumentStore = defineStore('document', () => {
    const documents = ref([] as Document[]);
    const currentDocument = ref({} as Document);
    const nrOfDocuments = ref(1);
    const totalPages = ref(1);
    const currentPage = ref(1);

    function reset() {
        documents.value = [] as Document[];
        currentDocument.value = {} as Document;
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

    async function loadDocument(documentId: number, orbisApiService: OrbisApiService) {
        try {
            const document = await orbisApiService.getDocument(documentId);
            if (document instanceof Document) {
                currentDocument.value = document;
            } else {
                console.error(document.errorMessage);
                // TODO, 06.01.2023 anf: correct error handling
                currentDocument.value.content = 'ERROR';
            }
        } catch (error) {
            return new Error("An error occurred while fetching document " + documentId);
        }
    }

    async function nextDocument(runId: number, orbisApiService: OrbisApiService) {
        if (!currentDocument.value._id) {
            return new Error("No valid id for current Document");
        }
        let document = await orbisApiService.nextDocument(runId, currentDocument.value._id);
        if (document instanceof Document) {
            currentDocument.value = document;
        } else {
            console.error(document.errorMessage);
            // TODO, 06.01.2023 anf: correct error handling
            currentDocument.value.content = 'ERROR';
        }
    }

    async function previousDocument(runId: number, orbisApiService: OrbisApiService) {
        if (!currentDocument.value._id) {
            return new Error("No valid id for current Document");
        }
        let document = await orbisApiService.previousDocument(runId, currentDocument.value._id);
        if (document instanceof Document) {
            currentDocument.value = document;
        } else {
            console.error(document.errorMessage);
            // TODO, 06.01.2023 anf: correct error handling
            currentDocument.value.content = 'ERROR';
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

    return {
        documents, currentDocument, nrOfDocuments, totalPages, currentPage, reset, loadDocuments, loadDocument,
        nextDocument, previousDocument, countDocuments
    };
});
