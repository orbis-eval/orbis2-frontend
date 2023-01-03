export class OrbisRepositoryService {

    private readonly orbisapibase: string

    constructor (orbisapibase: string) {
        this.orbisapibase = orbisapibase
    }

    async getRuns(corpusId: string) {
        return (await useAsyncData(() => $fetch(`${this.orbisapibase}getRuns?corpus_id=${corpusId}`))).data
    }

    async getDocument(documentId: string) {
        return (await useAsyncData(() => $fetch(`${this.orbisapibase}getDocument?document_id=${documentId}`))).data
    }
}
