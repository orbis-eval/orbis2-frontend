import {describe, test, expect, beforeEach, jest} from "@jest/globals";
import {useAnnotationStore} from "~/stores/annotationStore";
import {Annotation} from "~/lib/model/annotation";
import {AnnotationType} from "~/lib/model/annotationType";
import {Annotator} from "~/lib/model/annotator";
import {createPinia, setActivePinia} from "pinia";
import {NestedSetNode} from "~/lib/model/nestedset/nestedSetNode";
import {Error} from "~/lib/model/error";
import {OrbisApiService} from "~/lib/orbisApi/orbisApiService";

let mockedAnnotation: NestedSetNode;

const createMockedAnnotations = function (annotationId: number) {
    return new Annotation({
        key: 'my-key' + annotationId,
        surface_forms: ['surfaceForm'],
        start_indices: [0],
        end_indices: [12],
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
    createMockedAnnotations(1),
    createMockedAnnotations(2),
    createMockedAnnotations(3)
]);

jest.mock("~/lib/orbisApi/orbisApiService", () => {
    return {
        OrbisApiService: jest.fn().mockImplementation(() => ({
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
    test('load all annotations for document and a specific run',
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


            await annotationStore.loadAnnotations(documentId, documentContent, runId, annotationTypes,
                mockedOrbisApiService);

            const nestedSetNodeAnnotations = annotations.map(annotation => new NestedSetNode(annotation));
            expect(annotationStore.annotations).toEqual(nestedSetNodeAnnotations);
        });

});
