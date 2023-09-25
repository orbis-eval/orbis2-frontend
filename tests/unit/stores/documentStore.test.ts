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

function findDocumentById(docArray: Document[], targetId: number): Document | Error {
    const doc = docArray.find(doc => doc._id === targetId);
    if (doc) {
        return doc;
    } else  {
        return new Error("No Document found")
    }
}


// Create a mock class for OrbisApiService with all required methods for this test suite
jest.mock("~/lib/orbisApi/orbisApiService", () => {
    return {
        OrbisApiService: jest.fn().mockImplementation(() => ({
            getDocuments: async (runId: number, pageSize: number | undefined = undefined, skip: number = 0): Promise<Document[] | Error> => {
                return Parser.parseList(Document, Promise.resolve(documents));
            },
            countDocuments: async (runId: number): Promise<Number | Error> => {
                return documents.length;
            },
            nextDocument: async (runId: number, documentId: number): Promise<Document | Error> => {
                const id = documentId + 1;
                return findDocumentById(documents, id);
            },
            previousDocument: async (runId: number, documentId: number): Promise<Document | Error> => {
                const id = documentId - 1;
                return findDocumentById(documents, id);
            }
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
        expect(documentStore.totalPages).toEqual(1);
        expect(documentStore.currentPage).toEqual(1);
    });

    test('Resetting the state should return default initial state values', () => {
        const documentStore = useDocumentStore();
        documentStore.reset();

        expect(documentStore.documents).toEqual([] as Document[]);
        expect(documentStore.nrOfDocuments).toEqual(1);
        expect(documentStore.totalPages).toEqual(1);
        expect(documentStore.currentPage).toEqual(1);
    });

    test("loadDocuments should fetch and update documents", async () => {
        const documentStore = useDocumentStore();
        const runId = 1;
        const pageSize = 10;
        const skip = 0;

        await documentStore.loadDocuments(runId, mockedOrbisApiService, pageSize, skip);

        expect(documentStore.documents).toEqual(documents);
    });

    test("countDocuments should fetch and update the number of documents", async () => {
        const documentStore = useDocumentStore();
        const runId = 1;
        const mockedNumberOfDocuments = documents.length;

        await documentStore.countDocuments(runId, mockedOrbisApiService);

        expect(documentStore.nrOfDocuments).toEqual(mockedNumberOfDocuments);
    });

    test("nextDocument should fetch the next document and update the current document", async () => {
        const documentStore = useDocumentStore();
        documentStore.currentDocument = documents[0];
        const runId = 1;

        await documentStore.nextDocument(runId, mockedOrbisApiService);

        expect(documentStore.currentDocument).toEqual(documents[1]);
    });

    test("previousDocument should fetch the previous document and update the current document", async () => {
        const documentStore = useDocumentStore();
        documentStore.currentDocument = documents[2];
        const runId = 1;

        await documentStore.previousDocument(runId, mockedOrbisApiService);

        expect(documentStore.currentDocument).toEqual(documents[1]);
    });
});
