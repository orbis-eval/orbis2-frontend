import {beforeEach, describe, expect, jest, test} from "@jest/globals";
import {OrbisApiService} from "~/lib/orbisApi/orbisApiService";
import {Document} from "~/lib/model/document";
import {useDocumentStore} from "~/stores/documentStore";
import {createPinia, setActivePinia} from "pinia";
import {Error} from "~/lib/model/error";
import {Parser} from "~/lib/parser";
import {Metadata} from "~/lib/model/metadata";

// Helper function to create a Document object
const createDocument = (
    id: number,
    content: string,
    key: string,
    runId: number,
    metadata: Metadata[],
    done: boolean
): Document => {
    return new Document({
        _id: id,
        content: content,
        key: key,
        run_id: runId,
        metadata: metadata,
        done: done,
    });
};

const documents: Document[] = Array.from([
    createDocument(1, 'some content', 'key 1', 1, [], false),
    createDocument(2, 'some content', 'key 2', 1, [], false),
    createDocument(3, 'some content', 'key 3', 1, [], false),
]);


// Create a mock class for OrbisApiService with all required methods for this test suite
jest.mock("~/lib/orbisApi/orbisApiService", () => {
    return {
        OrbisApiService: jest.fn().mockImplementation(() => ({
            getDocuments: async (corpusId: number, pageSize: number | undefined = undefined, skip: number = 0): Promise<Document[] | Error> => {
                return Parser.parseList(Document, Promise.resolve(documents));
            },
            getNumberOfDocuments: async (corpusId: number, pageSize: number | undefined = undefined, skip: number = 0): Promise<Number | Error> => {
                return documents.length;
            },
        })),
    };
});

describe("Document Store", () => {
    const mockedOrbisApiService = new OrbisApiService('');

    beforeEach(() => {
        setActivePinia(createPinia());
    });

    test('Initial state should return default state values', () => {
        const documentStore = useDocumentStore();
        expect(documentStore.documents).toEqual([] as Document[]);
        expect(documentStore.nrOfDocuments).toEqual(1);
        expect(documentStore.nrOfPages).toEqual(1);
        expect(documentStore.currentSelectedDocPage).toEqual(1);
    });

    test('Resetting the state should return default initial state values', () => {
        const documentStore = useDocumentStore();
        documentStore.$reset();

        expect(documentStore.documents).toEqual([] as Document[]);
        expect(documentStore.nrOfDocuments).toEqual(1);
        expect(documentStore.nrOfPages).toEqual(1);
        expect(documentStore.currentSelectedDocPage).toEqual(1);
    });

    test("loadDocuments should fetch and update documents", async () => {
        const documentStore = useDocumentStore();
        const corpusId = 1;
        const pageSize = 10;
        const skip = 0;

        await documentStore.loadDocuments(corpusId, mockedOrbisApiService, pageSize, skip);

        expect(documentStore.documents).toEqual(documents);
    });

    test("getNumberOfDocuments should fetch and update the number of documents", async () => {
        const documentStore = useDocumentStore();
        const corpusId = 1;
        const pageSize = 10;
        const skip = 0;
        const mockedNumberOfDocuments = documents.length;

        await documentStore.getNumberOfDocuments(
            corpusId,
            mockedOrbisApiService,
            pageSize,
            skip
        );

        expect(documentStore.nrOfDocuments).toEqual(mockedNumberOfDocuments);
    });
});
