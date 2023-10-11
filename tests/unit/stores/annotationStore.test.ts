import {describe, it, expect, beforeEach, vi, afterEach} from "vitest";
import {useAnnotationStore} from "~/stores/annotationStore";
import {Annotation} from "~/lib/model/annotation";
import {AnnotationType} from "~/lib/model/annotationType";
import {Annotator} from "~/lib/model/annotator";
import {createPinia, setActivePinia} from "pinia";
import {NestedSetNode} from "~/lib/model/nestedset/nestedSetNode";
import {Error} from "~/lib/model/error";
import {OrbisApiService} from "~/lib/orbisApi/orbisApiService";

const createMockedAnnotations = function (annotationId: number, startIndex: number, endIndex: number) {
    return new Annotation({
        key: 'my-key' + annotationId,
        surface_forms: ['surfaceForm'],
        start_indices: [startIndex],
        end_indices: [endIndex],
        annotation_type: new AnnotationType({
            color_id: -1,
            name: 'type1',
            _id: 1
        }),
        annotator: new Annotator({
            name: 'name',
            roles: [],
            _id: 2
        }),
        run_id: 1,
        document_id: 1,
        metadata: [],
        timestamp: new Date(),
        _id: annotationId
    });
};

const createNestedSetNode = function (annotationId: number, startIndex: number, endIndex: number) {
    return new NestedSetNode(createMockedAnnotations(annotationId, startIndex, endIndex));
};

const annotations: Annotation[] = Array.from([
    createMockedAnnotations(1, 0, 5),
    createMockedAnnotations(2, 5, 7),
    createMockedAnnotations(3, 8, 10)
]);

vi.mock("~/lib/orbisApi/orbisApiService", () => {
    return {
        OrbisApiService: vi.fn().mockImplementation(() => ({
            getAnnotations: async (documentId: number, documentContent: string, runId: number,
                                   annotationTypes: AnnotationType[], orbisApiService: OrbisApiService):
                Promise<Annotation[] | Error> => {
                return annotations;
            }
        }))
    };
});

const commandHistoryExecuteSpy = vi.fn().mockResolvedValue(null);
vi.mock('~/lib/utils/annotation/annotationCommandHistory', () => {
    return {
        CommandHistory: vi.fn().mockImplementation(() => ({
            execute: commandHistoryExecuteSpy
        }))
    }
});

const mockedOrbisApiService = new OrbisApiService('');

beforeEach(() => {
    // necessary, otherwise the global store is not available
    setActivePinia(createPinia());
});

describe('AnnotationStore.loadAnnotations()', () => {
    it('load all annotations for document and a specific run',
        async () => {
            const annotationStore = useAnnotationStore();
            const documentId = 1;
            const runId = 1;
            const documentContent = 'test und noch ein test und noch ein test';
            const annotationTypes = [new AnnotationType({
                color_id: 1,
                name: 'type1',
                _id: 1
            })];


            await annotationStore.loadAnnotations(documentId, documentContent, runId, annotationTypes,
                mockedOrbisApiService);

            // check that the parent was set correctly
            expect(annotationStore.nestedSetRootNode).not.toBeNull();

            // check if child of root-node is correct, only child should be the line-node
            let lineNode = annotationStore?.nestedSetRootNode?.children[0];
            expect(lineNode?.children.length).toEqual(5);
            expect(lineNode?.start_indices[0]).toEqual(0);
            expect(lineNode?.end_indices[0]).toEqual(40);
        });

});

describe('Add annotations', () => {

    afterEach(() => {
        commandHistoryExecuteSpy.mockClear();
    });

    it('Add an annotation without calling loadAnnotations() should rise an exception', async () => {
        const annotationStore = useAnnotationStore();
        const documentId = 1;
        const runId = 1;
        const annotationTypes = [new AnnotationType({
            color_id: 1,
            name: 'type1',
            _id: 1
        })];
        const annotator = new Annotator({
            name: 'name',
            roles: [],
            _id: 2
        });

        await annotationStore.addAnnotation('test', 0, 5, annotationTypes[0],
            annotator, runId, documentId, mockedOrbisApiService);

        expect(commandHistoryExecuteSpy).not.toHaveBeenCalled();
        expect(annotationStore.isUndoDisabled).toBeTruthy();
        expect(annotationStore.isRedoDisabled).toBeTruthy();

    });

    it('Add an annotation after calling loadAnnotations()', async () => {
        const annotationStore = useAnnotationStore();
        const documentId = 1;
        const runId = 1;
        const documentContent = 'test und noch ein test und noch ein test';
        const annotationTypes = [new AnnotationType({
            color_id: 1,
            name: 'type1',
            _id: 1
        })];
        const annotator = new Annotator({
            name: 'name',
            roles: [],
            _id: 2
        });
        await annotationStore.loadAnnotations(documentId, documentContent, runId, annotationTypes,
            mockedOrbisApiService);
        await annotationStore.addAnnotation('test', 0, 5, annotationTypes[0],
            annotator, runId, documentId, mockedOrbisApiService);

        expect(commandHistoryExecuteSpy).toHaveBeenCalled();
        expect(annotationStore.isUndoDisabled).toBeFalsy();
        expect(annotationStore.isRedoDisabled).toBeTruthy();
    });
});


describe('Delete annotations', () => {

    afterEach(() => {
        commandHistoryExecuteSpy.mockClear();
    });

    it('Delete an annotation without calling loadAnnotations() should rise an exception', async () => {
        const annotationStore = useAnnotationStore();
        const annotation = createNestedSetNode(100, 1, 5);

        await annotationStore.deleteAnnotation(annotation, mockedOrbisApiService);

        expect(commandHistoryExecuteSpy).not.toHaveBeenCalled();
        expect(annotationStore.isUndoDisabled).toBeTruthy();
        expect(annotationStore.isRedoDisabled).toBeTruthy();

    });

    it('Delete an annotation after calling loadAnnotations()', async () => {
        const annotationStore = useAnnotationStore();
        const documentId = 1;
        const runId = 1;
        const documentContent = 'test und noch ein test und noch ein test';
        const annotationTypes = [new AnnotationType({
            color_id: 1,
            name: 'type1',
            _id: 1
        })];
        const annotation = createNestedSetNode(100, 1, 5);

        await annotationStore.loadAnnotations(documentId, documentContent, runId, annotationTypes,
            mockedOrbisApiService);
        await annotationStore.deleteAnnotation(annotation, mockedOrbisApiService);

        expect(commandHistoryExecuteSpy).toHaveBeenCalled();
        expect(annotationStore.isUndoDisabled).toBeFalsy();
        expect(annotationStore.isRedoDisabled).toBeTruthy();
    });
});

describe('Complex undo/redo patterns', () => {
    it('Delete a nested annotation and execute undo/redo',
        async () => {
            const annotationStore = useAnnotationStore();
            const documentId = 1;
            const runId = 1;
            const documentContent = 'test';
            const annotationTypes = [new AnnotationType({
                color_id: 1,
                name: 'type1',
                _id: 1
            })];

        });
});
