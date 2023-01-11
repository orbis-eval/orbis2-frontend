import {describe, expect, test} from "@jest/globals";
import {Annotation} from "~/lib/model/annotation";
import {AnnotationType} from "~/lib/model/annotationType";
import {Annotator} from "~/lib/model/annotator";
import {NestedSet} from "~/lib/model/nestedset/nestedSet";

describe('Nested Set', () => {
    test('test nested set', () => {
        let documentContent = 'AA BB CC DD EE FF GG HH II';

        let annotationType: AnnotationType = new AnnotationType({
            name: "A Type",
            _id: 1
        });

        let annotator: Annotator = new Annotator({
            name: "test annotator",
            roles: [],
            _id: 1
        });

        let mockAnnotations: Annotation[] = [
            mockAnnotation(
                'HH',
                21,
                23,
                6,
                annotationType,
                annotator,
            ),
            mockAnnotation(
                'AA',
                0,
                2,
                1,
                annotationType,
                annotator,
            ),
            mockAnnotation(
                'CC DD EE',
                6,
                14,
                2,
                annotationType,
                annotator
            ),
            mockAnnotation(
                'DD',
                9,
                11,
                3,
                annotationType,
                annotator,
            ),
            mockAnnotation(
                'FF GG',
                15,
                20,
                4,
                annotationType,
                annotator,
            ),
            mockAnnotation(
                'GG',
                18,
                20,
                5,
                annotationType,
                annotator
            ),
            mockAnnotation(
                'HH II',
                21,
                26,
                7,
                annotationType,
                annotator,
            )
        ];

        let rootNode = NestedSet.toTree(
            mockAnnotations,
            documentContent,
            annotationType,
            annotator,
            1,
            1,
            new Date(),
            1);

        // check if tree was correctly constructed
        expect(rootNode.children.length)
            .toEqual(4);
        expect(rootNode.children[0]._id).toEqual(1);
        expect(rootNode.children[1]._id).toEqual(2);
        expect(rootNode.children[2]._id).toEqual(4);
        expect(rootNode.children[3]._id).toEqual(7);
        expect(rootNode.children[0].children.length)
            .toEqual(0);
        expect(rootNode.children[1].children.length)
            .toEqual(1);
        expect(rootNode.children[1].children[0]._id)
            .toEqual(3);
        expect(rootNode.children[2].children.length)
            .toEqual(1);
        expect(rootNode.children[2].children[0]._id)
            .toEqual(5);
        expect(rootNode.children[3].children.length)
            .toEqual(1);
        expect(rootNode.children[3].children[0]._id)
            .toEqual(6);
    });
});

function mockAnnotation(
    surfaceForm: string,
    start: number,
    end: number,
    id: number,
    annotationType: AnnotationType,
    annotator: Annotator): Annotation {
    return new Annotation({
        key: "",
        surface_forms: [surfaceForm],
        start_indices: [start],
        end_indices: [end],
        annotation_type: annotationType,
        annotator: annotator,
        run_id: 1,
        document_id: 1,
        metadata: [],
        timestamp: new Date(),
        _id: id
    });
}


