import {Document} from "~/lib/model/document";
import {Error} from "~/lib/model/error";
import {Parser} from "~/lib/parser";
import {Corpus} from "~/lib/model/corpus";
import {Annotation} from "~/lib/model/annotation";
import {Run} from "~/lib/model/run"
import {TypedInternalResponse} from "nitropack";

export class OrbisApiService {

    private readonly orbisApiBase: string;

    constructor(orbisApiBase: string) {
        this.orbisApiBase = orbisApiBase;
    }

    async getCorpora(): Promise<Corpus[] | Error> {
        return Parser.parseList(Corpus,
            this.apiGet(`getCorpora`));
    }

    async getDocuments(corpusId: string): Promise<Document[] | Error> {
        return Parser.parseList(Document,
            this.apiGet(`getDocuments?corpus_id=${corpusId}`));
    }

    async getDocument(documentId: string): Promise<Document | Error> {
        return Parser.parse(Document,
            this.apiGet(`getDocument?document_id=${documentId}`));
    }

    async getRuns(corpusId: number): Promise<Run[] | Error> {
        return Parser.parseList(Run,
            this.apiGet(`getRuns?corpus_id=${corpusId}`));
    }

    async addAnnotation(annotation: Annotation): Promise<Number | Error> {
        return Parser.parse(Number,
            this.apiPost(`addAnnotation`, annotation));
    }

    async apiGet(query: string): Promise<TypedInternalResponse<string>> {
        return $fetch(`${this.orbisApiBase}${query}`, {
            method: 'GET'
        });
    }

    async apiPost(query: string, body: any): Promise<TypedInternalResponse<string>> {
        return $fetch(`${this.orbisApiBase}${query}`, {
            method: 'POST',
            body: JSON.stringify(body)
        })
    }

}
