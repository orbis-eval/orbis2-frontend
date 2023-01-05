import {Document} from "~/lib/model/document";
import {Error} from "~/lib/model/error";
import {IDocument} from "~/lib/model/idocument";
import {ID} from "@vue/devtools-api";
import {List} from "immutable";

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

    @parse<IDocument, Document>(Document)
    async getDocuments(corpusId: string): Promise<Response | Document[] | Error> {
        return fetch(`${this.orbisapibase}getDocuments?corpus_id=${corpusId}`)
    }

    @parse<IDocument, Document>(Document)
    async getDocument(documentId: string): Promise<Response | Document | Error> {
        return fetch(`${this.orbisapibase}getDocument?document_id=${documentId}`)
    }


}
function parse<T, U extends T>(constructor: new (data: T) => U) {
    return function parseDecorator(target: any, property: string, descriptor: PropertyDescriptor){
        const wrapped = descriptor.value;
        descriptor.value = function (): Promise<U|Error> {
            return wrapped.apply(this, arguments)
                .then(function(response: Response) {
                    return response.json();
                })
                .then(function(data: T | T[]) {
                    if (Array.isArray(data)) {
                        let result: U[] = [];
                        for (let d of data) {
                            result.push(new constructor(d))
                        }
                        return result;
                    } else {
                        return new constructor(data);
                    }
                })
                .catch(function(error: string) {
                    return new Error(error);
                })
        }
    }
}

