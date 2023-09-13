import {Document} from "~/lib/model/document";
import {Error} from "~/lib/model/error";
import {Parser} from "~/lib/parser";
import {Corpus} from "~/lib/model/corpus";
import {Annotation} from "~/lib/model/annotation";
import {Run} from "~/lib/model/run"
import {TypedInternalResponse} from "nitropack";
import {ColorPalette} from "~/lib/model/colorpalette";

export class OrbisApiService {

    private readonly orbisApiBase: string;

    constructor(orbisApiBase: string) {
        this.orbisApiBase = orbisApiBase;
    }

    async getCorpora(): Promise<Corpus[] | Error> {
        return Parser.parseList(Corpus,
            this.apiGet(`getCorpora`));
    }

    async getCorpus(corpusId: number): Promise<Corpus | Error> {
        return Parser.parse(Corpus,
            this.apiGet(`getCorpus?corpus_id=${corpusId}`));
    }

    async getDocuments(
                       runId: number,
                       pageSize: number,
                       skip: number = 0): Promise<Document[] | Error> {
        return Parser.parseList(Document,
            this.apiGet(`getDocuments?run_id=${runId}&page_size=${pageSize}&skip=${skip}`));
    }

    async getNumberOfDocuments(corpusId: number, // TODO: change to runId and countDocuments api call, remove the getNofDocuments api call
                               pageSize: number | undefined = undefined,
                               skip: number = 0): Promise<Number | Error> {
        let pageSizeParam = '';
        if (pageSize) {
            pageSizeParam = `&page_size=${pageSize}`;
        }
        return Parser.parse(Number, this.apiGet(`getNofDocuments?corpus_id=${corpusId}${pageSizeParam}&skip=${skip}`));
    }

    async getDocument(documentId: number): Promise<Document | Error> {
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
        let body = {"corpus": corpus} as any;
        if (documents.length > 0) {
            body.documents = documents;
        }
        return Parser.parse(Corpus,
            this.apiPost('addCorpus', body));
    }

    async addRun(newRun: Run, corpus: Corpus): Promise<Run | Error> {
        return Parser.parse(Run,
            this.apiPost(`addRun?run_name=${newRun.name}&run_description=${newRun.description}`,
                corpus));
    }

    async removeRun(run: Run): Promise<boolean | Error> {
        return Parser.parseEmptyResponse(this.apiDelete(`removeRun`, run));
    }

    async removeAnnotationFromDocument(annotation: Annotation): Promise<boolean | Error> {
        return Parser.parseEmptyResponse(this.apiDelete(`removeAnnotationFromDocument`, annotation));
    }

    async removeCorpus(corpus: Corpus): Promise<boolean | Error> {
        return Parser.parseEmptyResponse(this.apiDelete(`removeCorpus`, corpus));
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

    async nextDocument(runId: number, documentId: number): Promise<Document | Error> {
        return Parser.parse(Document,
            this.apiGet(`nextDocument?run_id=${runId}&document_id=${documentId}`));
    }

    async previousDocument(runId: number, documentId: number): Promise<Document | Error> {
        return Parser.parse(Document,
            this.apiGet(`previousDocument?run_id=${runId}&document_id=${documentId}`));
    }

    async countDocuments(runId: number): Promise<Number | Error> {
        // @ts-ignore
        return this.apiGet(`countDocuments?run_id=${runId}`);
    }

    async colorPalettes(): Promise<ColorPalette[] | Error> {
        return Parser.parseList(ColorPalette,
            this.apiGet(`colorPalettes`));
    }
}
