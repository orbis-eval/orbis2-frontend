import {Document} from "~/lib/model/document";
import {Error} from "~/lib/model/error";
import {Parser} from "~/lib/parser";
import {Corpus} from "~/lib/model/corpus";

export class OrbisRepositoryService {

    private readonly orbisapibase: string

    constructor (orbisapibase: string) {
        this.orbisapibase = orbisapibase
    }

    async getRuns(corpusId: string) {
        return (await useAsyncData(() => $fetch(`${this.orbisapibase}getRuns?corpus_id=${corpusId}`))).data
    }

    async getCorpora(): Promise<Corpus[] | Error> {
        return Parser.parseList(Corpus,
            fetch(`${this.orbisapibase}getCorpora`));
    }

    async getDocuments(corpusId: string): Promise<Document[] | Error> {
        return Parser.parseList(Document,
            fetch(`${this.orbisapibase}getDocuments?corpus_id=${corpusId}`));
    }

    async getDocument(documentId: string): Promise<Document | Error> {
        return Parser.parse(Document,
            fetch(`${this.orbisapibase}getDocument?document_id=${documentId}`));
    }


}
