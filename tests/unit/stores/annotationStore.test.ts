import {describe, it, expect, beforeEach, vi} from "vitest";
import {useAnnotationStore} from "~/stores/annotationStore";
import {Annotation} from "~/lib/model/annotation";
import {AnnotationType} from "~/lib/model/annotationType";
import {Annotator} from "~/lib/model/annotator";
import {createPinia, setActivePinia} from "pinia";
import {NestedSetNode} from "~/lib/model/nestedset/nestedSetNode";
import {Error} from "~/lib/model/error";
import {OrbisApiService} from "~/lib/orbisApi/orbisApiService";

let mockedAnnotation: NestedSetNode;

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
