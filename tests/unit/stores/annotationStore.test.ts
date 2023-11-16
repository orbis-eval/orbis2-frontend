import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { useAnnotationStore } from "~/stores/annotationStore";
import { Annotation } from "~/lib/model/annotation";
import { AnnotationType } from "~/lib/model/annotationType";
import { Annotator } from "~/lib/model/annotator";
import { NestedSetNode } from "~/lib/model/nestedset/nestedSetNode";
import { OrbisApiService } from "~/lib/orbisApi/orbisApiService";
import { TextSpan } from "~/lib/model/textSpan";

const annotationTypes = [
  new AnnotationType({
    colorId: 1,
    name: "type1",
    identifier: 1,
  }),
];
const annotator = new Annotator({
  name: "name",
  roles: [],
  identifier: 2,
});

const createMockedAnnotations = function (
  annotationId: number,
  startIndex: number,
  endIndex: number,
) {
  return new Annotation({
    key: "my-key" + annotationId,
    surfaceForms: ["surfaceForm"],
    startIndices: [startIndex],
    endIndices: [endIndex],
    annotationType: annotationTypes[0],
    annotator,
    runId: 1,
    documentId: 1,
    metadata: [],
    timestamp: new Date(),
    identifier: annotationId,
  });
};

const createNestedSetNode = function (
  annotationId: number,
  startIndex: number,
  endIndex: number,
) {
  return new NestedSetNode(
    createMockedAnnotations(annotationId, startIndex, endIndex),
  );
};

const firstAnnotation = createMockedAnnotations(1, 0, 5);
const secondAnnotation = createMockedAnnotations(2, 5, 7);
const thirdAnnotation = createMockedAnnotations(3, 8, 10);

const annotations: Annotation[] = Array.from([
  firstAnnotation,
  secondAnnotation,
  thirdAnnotation,
]);

vi.mock("~/lib/orbisApi/orbisApiService", () => {
  return {
    OrbisApiService: vi.fn().mockImplementation(() => ({
      getAnnotations: (): Annotation[] => {
        return annotations;
      },
    })),
  };
});

const commandHistoryExecuteSpy = vi.fn().mockResolvedValue(null);
const commandHistoryUndoSpy = vi.fn().mockResolvedValue(true);
const commandHistoryRedoSpy = vi.fn().mockResolvedValue(true);
vi.mock("~/lib/utils/annotation/annotationCommandHistory", () => {
  return {
    AnnotationCommandHistory: vi.fn().mockImplementation(() => ({
      execute: commandHistoryExecuteSpy,
      reset: vi.fn(),
      undo: commandHistoryUndoSpy,
      redo: commandHistoryRedoSpy,
    })),
  };
});

const mockedOrbisApiService = new OrbisApiService("");

beforeEach(() => {
  // necessary, otherwise the global store is not available
  setActivePinia(createPinia());
});

describe("AnnotationStore.loadAnnotations()", () => {
  it("load all annotations for document and a specific run", async () => {
    const annotationStore = useAnnotationStore();
    const documentId = 1;
    const runId = 1;
    const documentContent = "test und noch ein test und noch ein test";

    await annotationStore.loadAnnotations(
      documentId,
      documentContent,
      runId,
      annotationTypes,
      mockedOrbisApiService,
    );

    // check that the parent was set correctly
    expect(annotationStore.nestedSetRootNode).not.toBeNull();

    expect(annotationStore.selectedAnnotation?.startIndices[0]).equals(0);
    expect(annotationStore.selectedAnnotation?.endIndices[0]).equals(5);

    // check if child of root-node is correct, only child should be the line-node
    const lineNode = annotationStore?.nestedSetRootNode?.children[0];
    expect(lineNode?.children.length).toEqual(5);
    expect(lineNode?.startIndices[0]).toEqual(0);
    expect(lineNode?.endIndices[0]).toEqual(40);
  });
});

describe("Add annotations", () => {
  afterEach(() => {
    commandHistoryExecuteSpy.mockClear();
  });

  it("Add an annotation without calling loadAnnotations() should rise an exception", async () => {
    const annotationStore = useAnnotationStore();
    const documentId = 1;
    const runId = 1;
    const textSpan = new TextSpan("test", 0, 5);

    await expect(
      annotationStore.createAnnotation(
        textSpan,
        annotationTypes[0],
        annotator,
        runId,
        documentId,
        mockedOrbisApiService,
      ),
    ).rejects.toThrowError();

    expect(commandHistoryExecuteSpy).not.toHaveBeenCalled();
    expect(annotationStore.isUndoDisabled).toBeTruthy();
    expect(annotationStore.isRedoDisabled).toBeTruthy();
  });

  it("Add an annotation after calling loadAnnotations()", async () => {
    const annotationStore = useAnnotationStore();
    const documentId = 1;
    const runId = 1;
    const documentContent = "test und noch ein test und noch ein test";
    const textSpan = new TextSpan("test", 0, 5);

    await annotationStore.loadAnnotations(
      documentId,
      documentContent,
      runId,
      annotationTypes,
      mockedOrbisApiService,
    );
    await annotationStore.createAnnotation(
      textSpan,
      annotationTypes[0],
      annotator,
      runId,
      documentId,
      mockedOrbisApiService,
    );

    expect(commandHistoryExecuteSpy).toHaveBeenCalled();
    expect(annotationStore.isUndoDisabled).toBeFalsy();
    expect(annotationStore.isRedoDisabled).toBeTruthy();
  });
});

describe("Delete annotations", () => {
  afterEach(() => {
    commandHistoryExecuteSpy.mockClear();
  });

  it("Delete an annotation without calling loadAnnotations() should rise an exception", async () => {
    const annotationStore = useAnnotationStore();
    const annotation = createNestedSetNode(100, 1, 5);

    await expect(
      annotationStore.deleteAnnotation(annotation, mockedOrbisApiService),
    ).rejects.toThrowError();

    expect(commandHistoryExecuteSpy).not.toHaveBeenCalled();
    expect(annotationStore.isUndoDisabled).toBeTruthy();
    expect(annotationStore.isRedoDisabled).toBeTruthy();
  });

  it("Delete an annotation after calling loadAnnotations()", async () => {
    const annotationStore = useAnnotationStore();
    const documentId = 1;
    const runId = 1;
    const documentContent = "test und noch ein test und noch ein test";
    const annotation = createNestedSetNode(100, 1, 5);

    await annotationStore.loadAnnotations(
      documentId,
      documentContent,
      runId,
      annotationTypes,
      mockedOrbisApiService,
    );
    await annotationStore.deleteAnnotation(annotation, mockedOrbisApiService);

    expect(commandHistoryExecuteSpy).toHaveBeenCalled();
    expect(annotationStore.isUndoDisabled).toBeFalsy();
    expect(annotationStore.isRedoDisabled).toBeTruthy();
  });
});

describe("Test undo and redo", () => {
  afterEach(() => {
    commandHistoryRedoSpy.mockClear();
    commandHistoryUndoSpy.mockClear();
  });

  it("Undo previous command", async () => {
    const annotationStore = useAnnotationStore();

    await annotationStore.undoAnnotation();
    expect(commandHistoryUndoSpy).toHaveBeenCalled();
    expect(annotationStore.isUndoDisabled).toBeTruthy();
    expect(annotationStore.isRedoDisabled).toBeFalsy();
  });

  it("Redo previous command", async () => {
    const annotationStore = useAnnotationStore();

    await annotationStore.redoAnnotation();
    expect(commandHistoryRedoSpy).toHaveBeenCalled();
    expect(annotationStore.isUndoDisabled).toBeFalsy();
    expect(annotationStore.isRedoDisabled).toBeTruthy();
  });
});

describe("Navigate selected annotation", () => {
  it("Get next selected annotation", async () => {
    const annotationStore = useAnnotationStore();
    const documentId = 1;
    const runId = 1;
    const documentContent = "test und noch ein test und noch ein test";
    await annotationStore.loadAnnotations(
      documentId,
      documentContent,
      runId,
      annotationTypes,
      mockedOrbisApiService,
    );

    annotationStore.nextSelectedAnnotation();

    expect(annotationStore.selectedAnnotation?.key).equals("my-key2");
  });

  it("Get next selected annotation does not change if it is allready last element", async () => {
    const annotationStore = useAnnotationStore();
    const documentId = 1;
    const runId = 1;
    const documentContent = "test und noch ein test und noch ein test";
    await annotationStore.loadAnnotations(
      documentId,
      documentContent,
      runId,
      annotationTypes,
      mockedOrbisApiService,
    );
    const annotations = annotationStore.nestedSetRootNode?.allAnnotationNodes();
    if (annotations) {
      annotationStore.setSelectedAnnotation(annotations[2]);
    }

    annotationStore.nextSelectedAnnotation();

    expect(annotationStore.selectedAnnotation?.key).equals("my-key3");
  });

  it("Get previous selected annotation", async () => {
    const annotationStore = useAnnotationStore();
    const documentId = 1;
    const runId = 1;
    const documentContent = "test und noch ein test und noch ein test";
    await annotationStore.loadAnnotations(
      documentId,
      documentContent,
      runId,
      annotationTypes,
      mockedOrbisApiService,
    );
    const annotations = annotationStore.nestedSetRootNode?.allAnnotationNodes();
    if (annotations) {
      annotationStore.setSelectedAnnotation(annotations[2]);
    }

    annotationStore.prevSelectedAnnotation();

    expect(annotationStore.selectedAnnotation?.key).equals("my-key2");
  });

  it("Get previous selected annotation does not change if it is the first annotation", async () => {
    const annotationStore = useAnnotationStore();
    const documentId = 1;
    const runId = 1;
    const documentContent = "test und noch ein test und noch ein test";
    await annotationStore.loadAnnotations(
      documentId,
      documentContent,
      runId,
      annotationTypes,
      mockedOrbisApiService,
    );

    annotationStore.prevSelectedAnnotation();

    expect(annotationStore.selectedAnnotation?.key).equals("my-key1");
  });
});
