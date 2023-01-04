import {Document} from "~/lib/model/document";
import {Error} from "~/lib/model/error";

export class OrbisRepositoryService {

    private readonly orbisapibase: string

    constructor (orbisapibase: string) {
        this.orbisapibase = orbisapibase
    }

    async getRuns(corpusId: string) {
        return (await useAsyncData(() => $fetch(`${this.orbisapibase}getRuns?corpus_id=${corpusId}`))).data
    }

    async getCorpora() {
        return (await useAsyncData(() => $fetch(`${this.orbisapibase}getCorpora`)))
    }

    async getDocuments(corpusId: string) {
        return (await useAsyncData(() => $fetch(`${this.orbisapibase}getDocuments?corpus_id=${corpusId}`)))
    }

    async getDocument(documentId: string): Promise<Document|Error> {
        return fetch(`${this.orbisapibase}getDocument?document_id=${documentId}`)
            .then(response => {
                return response.json();
            })
            .then(data => {
                return new Document(data);
            })
            .catch(error => {
                return new Error(error);
            })
    }
}
