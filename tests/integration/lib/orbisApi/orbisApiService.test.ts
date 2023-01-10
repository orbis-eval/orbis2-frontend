import {describe, test, expect} from "@jest/globals";
import {Document} from "@/lib/model/document";
import {OrbisApiService} from "@/lib/orbisApi/orbisApiService";

class OrbisApiServiceMock extends OrbisApiService {

    mockedApiCallResponse;

    constructor(mockedApiCallResponse: Response) {
        super('');
        this.mockedApiCallResponse = mockedApiCallResponse;
    }

    async apiCall(query: string): Promise<Response> {
        return this.mockedApiCallResponse;
    }
}

describe('OrbisApiService.getDocument()', () => {
    test('get mocked document and parse it into correct document type', async () => {
        const orbisApiServiceMock = new OrbisApiServiceMock(
            {
                json: () => Promise.resolve({
                    'content': '1234',
                    'key': 'abc',
                    'run_id': 1234,
                    'metadata': [
                        {
                            'key': 'key',
                            'value': 'value',
                            '_id': 1
                        }
                    ],
                    'done': false,
                    '_id': 1234
                })
            } as Response
        );
        const parsedDocument = await orbisApiServiceMock.getDocument('1234');
        expect(parsedDocument instanceof Document).toBeTruthy();
        if (parsedDocument instanceof Document) {
            expect(parsedDocument.content).toEqual('1234');
            expect(parsedDocument.run_id).toEqual(1234);
            expect(parsedDocument._id).toEqual(1234);
            expect(parsedDocument.metadata.length).toEqual(1);
            expect(parsedDocument.metadata[0]._id).toEqual(1);
            expect(parsedDocument.metadata[0].key).toEqual('key');
            expect(parsedDocument.metadata[0].value).toEqual('value');

        }
    });
});

describe('OrbisApiService.getDocuments()', () => {
    test('get mocked list of documents and parse it into correct list of document types', async () => {
        const orbisApiServiceMock = new OrbisApiServiceMock(
            {
                json: () => Promise.resolve([
                    {
                        'content': '1234',
                        'key': 'abc',
                        'run_id': 1234,
                        'metadata': [
                            {
                                'key': 'key',
                                'value': 'value',
                                '_id': 1
                            }
                        ],
                        'done': false,
                        '_id': 1234
                    },
                    {
                        'content': '5678',
                        'key': 'def',
                        'run_id': 5678,
                        'metadata': [
                            {
                                'key': 'key1',
                                'value': 'value1',
                                '_id': 1
                            },
                            {
                                'key': 'key2',
                                'value': 'value2',
                                '_id': 2
                            }
                        ],
                        'done': false,
                        '_id': 5678
                    },
                ])
            } as Response
        );
        const parsedDocuments = await orbisApiServiceMock.getDocuments('');
        expect(Array.isArray(parsedDocuments)).toBeTruthy();
        if (Array.isArray(parsedDocuments)) {
            expect(parsedDocuments.length).toEqual(2);
            expect(parsedDocuments[0].content).toEqual('1234');
            expect(parsedDocuments[0].run_id).toEqual(1234);
            expect(parsedDocuments[0]._id).toEqual(1234);
            expect(parsedDocuments[1].content).toEqual('5678');
            expect(parsedDocuments[1].run_id).toEqual(5678);
            expect(parsedDocuments[1]._id).toEqual(5678);
            expect(parsedDocuments[1].metadata.length).toEqual(2);
            expect(parsedDocuments[1].metadata[0]._id).toEqual(1);
            expect(parsedDocuments[1].metadata[0].key).toEqual('key1');
            expect(parsedDocuments[1].metadata[0].value).toEqual('value1');
            expect(parsedDocuments[1].metadata[1]._id).toEqual(2);
            expect(parsedDocuments[1].metadata[1].key).toEqual('key2');
            expect(parsedDocuments[1].metadata[1].value).toEqual('value2');
        }
    });
});

describe('OrbisApiService.getCorpora()', () => {
    test('get mocked list of corpora and parse it into correct list of corpus types', async () => {
        const orbisApiServiceMock = new OrbisApiServiceMock(
            {
                json: () => Promise.resolve([
                    {
                        'name': 'corpus1',
                        'supported_annotation_types': [
                            {
                                'name': 'annotation-type1',
                                '_id': 1
                            },
                            {
                                'name': 'annotation-type2',
                                '_id': 2
                            }
                        ],
                        '_id': 11
                    },
                    {
                        'name': 'corpus2',
                        'supported_annotation_types': [
                            {
                                'name': 'annotation-type2',
                                '_id': 2
                            }
                        ],
                        '_id': 12
                    },
                ])
            } as Response
        );
        const parsedCorpora = await orbisApiServiceMock.getCorpora();
        expect(Array.isArray(parsedCorpora)).toBeTruthy();
        if (Array.isArray(parsedCorpora)) {
            expect(parsedCorpora.length).toEqual(2);
            expect(parsedCorpora[0].name).toEqual('corpus1');
            expect(parsedCorpora[0]._id).toEqual(11);
            expect(parsedCorpora[0].supported_annotation_types.length).toEqual(2);
            expect(parsedCorpora[0].supported_annotation_types[0]._id).toEqual(1);
            expect(parsedCorpora[0].supported_annotation_types[1].name).toEqual('annotation-type2');
            expect(parsedCorpora[1].name).toEqual('corpus2');
            expect(parsedCorpora[1]._id).toEqual(12);
            expect(parsedCorpora[1].supported_annotation_types.length).toEqual(1);
            expect(parsedCorpora[1].supported_annotation_types[0]._id).toEqual(2);
            expect(parsedCorpora[1].supported_annotation_types[0].name).toEqual('annotation-type2');
        }
    });
});
