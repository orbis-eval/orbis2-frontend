import {describe, expect, test} from "@jest/globals";
import {NestedSet} from "~/lib/model/nestedset/nestedSet";
import {
    annotationType,
    annotator,
    errorCallBack,
    mockAnnotationNode
} from "~/tests/unit/lib/model/nestedset/nestedSetUtils";

describe('NestedSetNode.getAnnotations(...)', () => {
    test('get all annotations from a node', () => {
        let mockAnnotations = [
            mockAnnotationNode('AA', 0, 2, 1, annotationType, annotator),
            mockAnnotationNode('CC DD EE', 6, 14, 2, annotationType, annotator),
            mockAnnotationNode('DD', 9, 11, 3, annotationType, annotator)
        ];
        let rootNode = NestedSet.toTree(
            mockAnnotations,
            'AA BB CC DD EE',
            1,
            1,
            new Date(),
            errorCallBack);
        expect(rootNode).not.toBeNull();
        if (rootNode) {
            let annotations = rootNode.allAnnotationNodes();
            expect(annotations.length).toEqual(3);
            expect(annotations[0].start_indices[0]).toEqual(0);
            expect(annotations[0].end_indices[0]).toEqual(2);
            expect(annotations[1].start_indices[0]).toEqual(6);
            expect(annotations[1].end_indices[0]).toEqual(14);
            expect(annotations[2].start_indices[0]).toEqual(9);
            expect(annotations[2].end_indices[0]).toEqual(11);
        }
    });
});

describe('test json serialization', () => {
    test('test annotation json serialization', () => {
        let annotationNode = mockAnnotationNode('A   ', 0, 4, 1, annotationType, annotator);
        expect(('_id' in annotationNode)).toBeTruthy();
        expect(('_id' in annotationNode.annotation_type)).toBeTruthy();
        expect(('_id' in annotationNode.annotator)).toBeTruthy();
        // serialize to json
        let annotationJsonString = JSON.stringify(annotationNode);
        // parse back to object
        let parsedAnnotation = JSON.parse(annotationJsonString);
        // the id's should NOT be contained anymore in the objects
        expect(!('_id' in parsedAnnotation)).toBeTruthy();
        expect(!('_id' in parsedAnnotation.annotation_type)).toBeTruthy();
        expect(!('_id' in parsedAnnotation.annotator)).toBeTruthy();
    });
});



