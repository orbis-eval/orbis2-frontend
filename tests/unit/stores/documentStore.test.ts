import { beforeEach, describe, expect, vi, it } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { OrbisApiService } from "~/lib/orbisApi/orbisApiService";
import { Document } from "~/lib/model/document";
import { useDocumentStore } from "~/stores/documentStore";
import { Parser } from "~/lib/parser";
import { Metadata } from "~/lib/model/metadata";

// Helper function to create a Document object
const createDocument = (
  id: number,
  content: string,
  key: string,
  runId: number,
  metadata: Metadata[],
  done: boolean,
): Document => {
  return new Document({
    identifier: id,
    content,
    key,
    runId,
    metadata,
    done,
  });
};

const documents: Document[] = Array.from([
  createDocument(1, "some content", "key 1", 1, [], false),
  createDocument(2, "some content", "key 2", 1, [], false),
  createDocument(3, "some content", "key 3", 1, [], false),
]);

function findDocumentById(
  docArray: Document[],
  targetId: number,
): Document | Error {
  const doc = docArray.find((doc) => doc.identifier === targetId);
  if (doc) {
    return doc;
  } else {
    return new Error("No Document found");
  }
}

// Create a mock class for OrbisApiService with all required methods for this test suite
vi.mock("~/lib/orbisApi/orbisApiService", () => {
  return {
    OrbisApiService: vi.fn().mockImplementation(() => ({
      getDocuments: (): Promise<Document[] | Error> => {
        return Parser.parseList(Document, Promise.resolve(documents));
      },
      countDocuments: (): number => {
        return documents.length;
      },
      nextDocument: (documentId: number): Document | Error => {
        const id = documentId + 1;
        return findDocumentById(documents, id);
      },
      previousDocument: (
        _runId: number,
        documentId: number,
      ): Document | Error => {
        const id = documentId - 1;
        return findDocumentById(documents, id);
      },
    })),
  };
});

describe("Document Store", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("Initial state should return default state values", () => {
    const documentStore = useDocumentStore();
    expect(documentStore.documents).toEqual([] as Document[]);
    expect(documentStore.nrOfDocuments).toEqual(1);
    expect(documentStore.totalPages).toEqual(1);
    expect(documentStore.currentPage).toEqual(1);
  });

  it("Resetting the state should return default initial state values", () => {
    const documentStore = useDocumentStore();
    documentStore.reset();

    expect(documentStore.documents).toEqual([] as Document[]);
    expect(documentStore.nrOfDocuments).toEqual(1);
    expect(documentStore.totalPages).toEqual(1);
    expect(documentStore.currentPage).toEqual(1);
  });

  it("loadDocuments should fetch and update documents", async () => {
    const documentStore = useDocumentStore();
    const runId = 1;
    const pageSize = 10;
    const skip = 0;

    await documentStore.loadDocuments(runId, pageSize, skip);

    expect(documentStore.documents).toEqual(documents);
  });

  it("countDocuments should fetch and update the number of documents", async () => {
    const documentStore = useDocumentStore();
    const runId = 1;
    const mockedNumberOfDocuments = documents.length;

    await documentStore.countDocuments(runId);

    expect(documentStore.nrOfDocuments).toEqual(mockedNumberOfDocuments);
  });

  it("nextDocument should fetch the next document and update the current document", async () => {
    const documentStore = useDocumentStore();
    documentStore.currentDocument = documents[0];

    let documentId: number = documentStore.currentDocument.identifier || 0;

    documentStore.currentDocument =
      await documentStore.nextDocument(documentId);

    expect(documentStore.currentDocument).toEqual(documents[1]);
  });

  it("previousDocument should fetch the previous document and update the current document", async () => {
    const documentStore = useDocumentStore();
    documentStore.currentDocument = documents[2];
    const runId = 1;

    documentStore.currentDocument = await documentStore.previousDocument(runId);

    expect(documentStore.currentDocument).toEqual(documents[1]);
  });
});
