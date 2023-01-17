import {describe, expect, test} from "@jest/globals";
import {Annotation} from "~/lib/model/annotation";
import {AnnotationType} from "~/lib/model/annotationType";
import {Annotator} from "~/lib/model/annotator";
import {NestedSet} from "~/lib/model/nestedset/nestedSet";
import {NestedSetParseError} from "~/lib/model/nestedset/nestedSetParseError";
describe('NestedSet.toTree(...)', () => {
    test('test calculating the tree', () => {

        let mockAnnotations: Annotation[] = [
            mockAnnotation('AABB', 0, 4, 1, annotationType, annotator),
            mockAnnotation('AA', 0, 2, 2, annotationType, annotator),
            mockAnnotation('A', 0, 1, 3, annotationType, annotator),
            mockAnnotation('DD', 6, 8, 4, annotationType, annotator)
        ];
        // calculate the tree
        let rootNode = NestedSet.toTree(
            mockAnnotations,
            'AABBCCDDEE',
            1,
            1,
            new Date(),
            errorCallBack);
        if(rootNode) {
            expect(rootNode.children.length).toEqual(4);

            // check the gap-annotations in the rootnode
            expect(rootNode.children[1].annotation_type.name).toEqual(NestedSet.GAP_ANNOTATION_TYPE_NAME);
            expect(rootNode.children[1].start_indices[0]).toEqual(4);
            expect(rootNode.children[1].end_indices[0]).toEqual(6);
            expect(rootNode.children[3].annotation_type.name).toEqual(NestedSet.GAP_ANNOTATION_TYPE_NAME);
            expect(rootNode.children[3].start_indices[0]).toEqual(8);
            expect(rootNode.children[3].end_indices[0]).toEqual(10);

            // check the node "AABB"
            expect(rootNode.children[0]._id).toEqual(mockAnnotations[0]._id);
            // check the childs of "AABB"
            expect(rootNode.children[0].children[0]._id).toEqual(mockAnnotations[1]._id);
            expect(rootNode.children[0].children[1].annotation_type.name).toEqual(NestedSet.GAP_ANNOTATION_TYPE_NAME);

            // check the childs of "AA"
            expect(rootNode.children[0].children[0].children[0]._id).toEqual(mockAnnotations[2]._id);
            expect(rootNode.children[0].children[0].children[0].children.length).toEqual(0);
            // check the gap annotation
            expect(rootNode.children[0].children[0].children[1].start_indices[0]).toEqual(1);
            expect(rootNode.children[0].children[0].children[1].end_indices[0]).toEqual(2);

            // check annotation "DD"
            expect(rootNode.children[2]._id).toEqual(mockAnnotations[3]._id);
            expect(rootNode.children[2].children.length).toEqual(0);
        }
    });

    test('test small example', () => {
        let mockAnnotations = [
            mockAnnotation('AA', 0, 2, 1, annotationType, annotator),
            mockAnnotation('CC DD EE', 6, 14, 2, annotationType, annotator),
            mockAnnotation('DD', 9, 11, 3, annotationType, annotator)
        ]
        let rootNode = NestedSet.toTree(
            mockAnnotations,
            'AA BB CC DD EE',
            1,
            1,
            new Date(),
            errorCallBack);
        if(rootNode) {
            expect(rootNode.children.length).toEqual(3);
            // gap-annotation "CC"
            expect(rootNode.children[2].children[0].surface_forms[0]).toEqual("CC ");
            expect(rootNode.children[2].children[0].start_indices[0]).toEqual(6);
            expect(rootNode.children[2].children[0].end_indices[0]).toEqual(9);
            expect(rootNode.children[2].children[1]._id).toEqual(mockAnnotations[2]._id);
            expect(rootNode.children[2].children[2].surface_forms[0]).toEqual(" EE");
            expect(rootNode.children[2].children[2].start_indices[0]).toEqual(11);
            expect(rootNode.children[2].children[2].end_indices[0]).toEqual(14);
        }
    });

    test('test creating tree from incorrect overlapping annotations', () => {

        let documentString = 'ABCD';
        let mockAnnotations = [
            mockAnnotation('AB', 0, 2, 1, annotationType, annotator),
            mockAnnotation('BC', 1, 3, 2, annotationType, annotator)
        ];
        let rootNode = NestedSet.toTree(
            mockAnnotations,
            documentString,
            1,
            1,
            new Date(),
            errorCallBack);
        expect(rootNode).toEqual(null);
        expect(currentParseError.nodes.length).toEqual(2);
        expect(currentParseError.nodes[0].start_indices[0]).toEqual(0);
        expect(currentParseError.nodes[0].end_indices[0]).toEqual(2);
        expect(currentParseError.nodes[1].start_indices[0]).toEqual(1);
        expect(currentParseError.nodes[1].end_indices[0]).toEqual(3);
    });
});


let annotationType: AnnotationType = new AnnotationType({
    name: "A Type",
    _id: 1
});

let annotator: Annotator = new Annotator({
    name: "test annotator",
    roles: [],
    _id: 1
});

let currentParseError: NestedSetParseError;

let errorCallBack = (parseError: NestedSetParseError) => {
    console.warn('the following nodes could not be parsed:')
    for(let node of parseError.nodes) {
        console.warn(`${node.surface_forms[0]}/(${node.start_indices[0]}:${node.end_indices[0]})`);
    }
    currentParseError = parseError;
};

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



