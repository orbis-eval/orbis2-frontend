import {describe, test, expect, beforeEach} from "@jest/globals";
import {useAnnotationStore} from "~/stores/annotationStore";
import {Annotation} from "~/lib/model/annotation";
import {AnnotationType} from "~/lib/model/annotationType";
import {Annotator} from "~/lib/model/annotator";
import {createPinia, setActivePinia} from "pinia";

let mockedAnnotation: Annotation;

beforeEach(() => {
    // necessary, otherwise the global store is not available
    setActivePinia(createPinia());
    mockedAnnotation = new Annotation({
        key: 'my-key',
        surface_forms: ['surfaceForm'],
        start_indices: [0],
        end_indices: [12],
        annotation_type: new AnnotationType({
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
        _id: 3
    });
})

describe('AnnotationStore.addAnnotation()', () => {
    test('add annotation to annotations list, list contains one element afterwards', () => {
        const annotationStore = useAnnotationStore();

        expect(annotationStore.annotations.length).toEqual(0);
        annotationStore.addAnnotation(mockedAnnotation);
        expect(annotationStore.annotations.length).toEqual(1);
    });

    test('simulate undoing and adding a new annotation, after adding new annotation, ' +
        'redoing is no longer possible', () => {
        const annotationStore = useAnnotationStore();
        let annotation2 = new Annotation(mockedAnnotation);
        annotation2.key = 'my-key2'
        let annotation3 = new Annotation(mockedAnnotation);
        annotation3.key = 'my-key3'

        annotationStore.addAnnotation(mockedAnnotation);
        annotationStore.addAnnotation(annotation2);
        annotationStore.undoAnnotation(() => {});
        annotationStore.addAnnotation(annotation3)

        expect(annotationStore.undoneAnnotations.length).toEqual(0)
        expect(annotationStore.annotations.length).toEqual(2);
        expect(annotationStore.annotations[0].key).toEqual('my-key');
        expect(annotationStore.annotations[1].key).toEqual('my-key3');
    })
});

describe('AnnotationStore.popAnnotation()', () => {
    test('pop last annotation from annotations list, list is empty afterwards', () => {
        const annotationStore = useAnnotationStore();

        annotationStore.addAnnotation(mockedAnnotation);
        let annotation = annotationStore.popAnnotation();

        expect(annotationStore.annotations.length).toEqual(0);
        expect(annotation?.key).toEqual('my-key');
    });

    test('annotations list is empty, pop last element does not throw any error nor change the state, ' +
        'returns undefined', () => {
        const annotationStore = useAnnotationStore();

        let annotation = annotationStore.popAnnotation();

        expect(annotationStore.annotations.length).toEqual(0);
        expect(annotation).toBeUndefined();
    })
});

describe('AnnotationStore.undoAnnotation()', () => {
    test('undo last annotation, undoneAnnotations list contains this element afterwards, callback is executed',
        () => {
        const annotationStore = useAnnotationStore();
        let callbackCounter = 0;
        let annotation2 = new Annotation(mockedAnnotation);
        annotation2.key = 'my-key2';
        let annotation3 = new Annotation(mockedAnnotation);
        annotation3.key = 'my-key3';

        annotationStore.addAnnotation(mockedAnnotation);
        annotationStore.addAnnotation(annotation2);
        annotationStore.addAnnotation(annotation3);
        annotationStore.undoAnnotation(() => { callbackCounter++; });

        expect(annotationStore.annotations.length).toEqual(2);
        expect(annotationStore.undoneAnnotations.length).toEqual(1);
        expect(annotationStore.annotations[0].key).toEqual('my-key');
        expect(annotationStore.annotations[1].key).toEqual('my-key2');
        expect(annotationStore.undoneAnnotations[0].key).toEqual('my-key3');
        expect(callbackCounter).toEqual(1);
    });

    test('annotations list is empty, undo annotations does not throw any errors, nor change the state, ' +
        'callback is not executed', () => {
        const annotationStore = useAnnotationStore();
        let callbackCounter = 0;

        annotationStore.undoAnnotation(() => { callbackCounter++; })
        expect(annotationStore.annotations.length).toEqual(0);
        expect(annotationStore.undoneAnnotations.length).toEqual(0);
        expect(callbackCounter).toEqual(0);
    })
});

describe('AnnotationStore.redoAnnotation()', () => {
    test('redo last undone annotation, annotations list contains this element again, callback is executed',
        () => {
            const annotationStore = useAnnotationStore();
            let callbackCounter = 0;
            let annotation2 = new Annotation(mockedAnnotation);
            annotation2.key = 'my-key2';
            let annotation3 = new Annotation(mockedAnnotation);
            annotation3.key = 'my-key3';

            annotationStore.addAnnotation(mockedAnnotation);
            annotationStore.addAnnotation(annotation2);
            annotationStore.addAnnotation(annotation3);
            annotationStore.undoAnnotation(() => {});
            annotationStore.undoAnnotation(() => {});
            annotationStore.redoAnnotation(() => { callbackCounter++; })

            expect(annotationStore.annotations.length).toEqual(2);
            expect(annotationStore.undoneAnnotations.length).toEqual(1);
            expect(annotationStore.annotations[0].key).toEqual('my-key');
            expect(annotationStore.annotations[1].key).toEqual('my-key2');
            expect(annotationStore.undoneAnnotations[0].key).toEqual('my-key3');
            expect(callbackCounter).toEqual(1);
        });

    test('undone annotations list is empty, redo annotations does not throw any errors, ' +
        'nor change the state, callback is not executed', () => {
        const annotationStore = useAnnotationStore();
        let callbackCounter = 0;

        annotationStore.redoAnnotation(() => { callbackCounter++; })
        expect(annotationStore.annotations.length).toEqual(0);
        expect(annotationStore.undoneAnnotations.length).toEqual(0);
        expect(callbackCounter).toEqual(0);
    })
});