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

    async getDocument(documentId: string) {
        return (await useAsyncData(() => $fetch(`${this.orbisapibase}getDocument?document_id=${documentId}`)))
    }
}
