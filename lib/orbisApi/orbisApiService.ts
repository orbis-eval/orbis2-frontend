import {Document} from "~/lib/model/document";
import {Error} from "~/lib/model/error";
import {Parser} from "~/lib/parser";
import {Corpus} from "~/lib/model/corpus";

export class OrbisApiService {

    private readonly orbisApiBase: string;

    constructor(orbisApiBase: string) {
        this.orbisApiBase = orbisApiBase;
    }

    async getCorpora(): Promise<Corpus[] | Error> {
        return Parser.parseList(Corpus,
            this.apiCall(`getCorpora`));
    }

    async getDocuments(corpusId: string): Promise<Document[] | Error> {
        return Parser.parseList(Document,
            this.apiCall(`getDocuments?corpus_id=${corpusId}`));
    }

    async getDocument(documentId: string): Promise<Document | Error> {
        return Parser.parse(Document,
            this.apiCall(`getDocument?document_id=${documentId}`));
    }

    async apiCall(query: string): Promise<Response> {
        return fetch(`${this.orbisApiBase}${query}`);
    }

}
