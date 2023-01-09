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
            fetch(`${this.orbisApiBase}getCorpora`));
    }

    async getDocuments(corpusId: string): Promise<Document[] | Error> {
        return Parser.parseList(Document,
            fetch(`${this.orbisApiBase}getDocuments?corpus_id=${corpusId}`));
    }

    async getDocument(documentId: string): Promise<Document | Error> {
        return Parser.parse(Document,
            fetch(`${this.orbisApiBase}getDocument?document_id=${documentId}`));
    }


}
