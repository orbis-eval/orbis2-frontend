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

    async getDocuments(corpusId: string,
                       pageSize: number | undefined = undefined,
                       skip: number = 0): Promise<Document[] | Error> {
        let pageSizeParam = '';
        if (pageSize) {
            pageSizeParam = `&page_size=${pageSize}`;
        }
        return Parser.parseList(Document,
            this.apiGet(`getDocuments?corpus_id=${corpusId}${pageSizeParam}&skip=${skip}`));
    }

    async getDocument(documentId: string): Promise<Document | Error> {
        return Parser.parse(Document,
            this.apiGet(`getDocument?document_id=${documentId}`));
    }

    async getRuns(corpusId: number): Promise<Run[] | Error> {
        return Parser.parseList(Run,
            this.apiGet(`getRuns?corpus_id=${corpusId}`));
    }

    async getAnnotations(runId?: number, documentId?: number): Promise<Annotation[] | Error> {
        return Parser.parseList(Annotation,
            this.apiGet(`getAnnotations?run_id=${runId}&document_id=${documentId}`));
    }

    async addAnnotation(annotation: Annotation): Promise<Annotation | Error> {
        return Parser.parse(Annotation,
            this.apiPost(`addAnnotation`, annotation));
    }

    async addCorpus(corpus: Corpus, documents: Document[] = []): Promise<Corpus | Error> {
        let body = corpus as any;
        if (documents.length > 0) {
            body = {"corpus": corpus,
                    "documents": documents};
        }
        return Parser.parse(Corpus,
            this.apiPost('addCorpus', body));
    }

    async removeAnnotationFromDocument(annotation: Annotation): Promise<boolean | Error> {
        return Parser.parseEmptyResponse(this.apiDelete(`removeAnnotationFromDocument`, annotation));
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

    async apiDelete(query: string, body: any): Promise<TypedInternalResponse<string>> {
        return $fetch(`${this.orbisApiBase}${query}`, {
            method: 'DELETE',
            body: JSON.stringify(body)
        })
    }

}
