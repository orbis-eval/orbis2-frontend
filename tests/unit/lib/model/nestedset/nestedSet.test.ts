import {describe, expect, it} from "vitest";
import {NestedSet} from "~/lib/model/nestedset/nestedSet";
import {NestedSetNode} from "~/lib/model/nestedset/nestedSetNode";
import {
    annotationType,
    annotator, currentParseError,
    errorCallBack,
    mockAnnotationNode
} from "~/tests/unit/lib/model/nestedset/nestedSetUtils";

describe('NestedSet.toTree(...)', () => {
    it('test calculating the tree', () => {

        let mockAnnotationNodes: NestedSetNode[] = [
            mockAnnotationNode('AABB', 0, 4, 1, annotationType, annotator),
            mockAnnotationNode('AA', 0, 2, 2, annotationType, annotator),
            mockAnnotationNode('A', 0, 1, 3, annotationType, annotator),
            mockAnnotationNode('DD', 6, 8, 4, annotationType, annotator)
        ];
        // calculate the tree
        let rootNode = NestedSet.toTree(
            mockAnnotationNodes,
            'AABBCCDDEE',
            1,
            1,
            new Date(),
            errorCallBack);
        expect(rootNode).not.toBeNull();
        if (rootNode) {

            // first child has to be a line annotation
            expect(rootNode.children.length).toEqual(1);

            // the only children of root should be a line annotation
            let lineAnnotationNode = rootNode.children[0];
            expect(lineAnnotationNode.annotation_type.name).toEqual(NestedSet.LINE_ANNOTATION_TYPE_NAME);

            // check the gap-annotations in the line-node
            expect(lineAnnotationNode.children[1].annotation_type.name).toEqual(NestedSet.GAP_ANNOTATION_TYPE_NAME);
            expect(lineAnnotationNode.children[1].start_indices[0]).toEqual(4);
            expect(lineAnnotationNode.children[1].end_indices[0]).toEqual(6);
            expect(lineAnnotationNode.children[3].annotation_type.name).toEqual(NestedSet.GAP_ANNOTATION_TYPE_NAME);
            expect(lineAnnotationNode.children[3].start_indices[0]).toEqual(8);
            expect(lineAnnotationNode.children[3].end_indices[0]).toEqual(10);

            // check the node "AABB"
            expect(lineAnnotationNode.children[0]._id).toEqual(mockAnnotationNodes[0]._id);
            // check the childs of "AABB"
            expect(lineAnnotationNode.children[0].children[0]._id).toEqual(mockAnnotationNodes[1]._id);
            expect(lineAnnotationNode.children[0].children[1].annotation_type.name).toEqual(NestedSet.GAP_ANNOTATION_TYPE_NAME);

            // check the childs of "AA"
            expect(lineAnnotationNode.children[0].children[0].children[0]._id).toEqual(mockAnnotationNodes[2]._id);
            expect(lineAnnotationNode.children[0].children[0].children[0].children.length).toEqual(0);
            // check the gap annotation
            expect(lineAnnotationNode.children[0].children[0].children[1].start_indices[0]).toEqual(1);
            expect(lineAnnotationNode.children[0].children[0].children[1].end_indices[0]).toEqual(2);

            // check annotation "DD"
            expect(lineAnnotationNode.children[2]._id).toEqual(mockAnnotationNodes[3]._id);
            expect(lineAnnotationNode.children[2].children.length).toEqual(0);
        }
    });

    it('test small example', () => {
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
            expect(rootNode.children.length).toEqual(1);

            // first node should be a line annotation
            let lineAnnotationNode = rootNode.children[0];
            expect(lineAnnotationNode.annotation_type.name).toEqual(NestedSet.LINE_ANNOTATION_TYPE_NAME);

            expect(lineAnnotationNode.children[2].children[0].surface_forms[0]).toEqual("CC ");
            expect(lineAnnotationNode.children[2].children[0].start_indices[0]).toEqual(6);
            expect(lineAnnotationNode.children[2].children[0].end_indices[0]).toEqual(9);
            expect(lineAnnotationNode.children[2].children[1]._id).toEqual(mockAnnotations[2]._id);
            expect(lineAnnotationNode.children[2].children[2].surface_forms[0]).toEqual(" EE");
            expect(lineAnnotationNode.children[2].children[2].start_indices[0]).toEqual(11);
            expect(lineAnnotationNode.children[2].children[2].end_indices[0]).toEqual(14);
        }
    });

    it('test creating tree from incorrect overlapping annotations', () => {

        let documentString = 'ABCD';
        let mockAnnotations = [
            mockAnnotationNode('AB', 0, 2, 1, annotationType, annotator),
            mockAnnotationNode('BC', 1, 3, 2, annotationType, annotator)
        ];
        let rootNode = NestedSet.toTree(
            mockAnnotations,
            documentString,
            1,
            1,
            new Date(),
            errorCallBack);
        expect(rootNode).toBeNull();
        expect(currentParseError.nodes.length).toEqual(2);
        expect(currentParseError.nodes[0].start_indices[0]).toEqual(0);
        expect(currentParseError.nodes[0].end_indices[0]).toEqual(2);
        expect(currentParseError.nodes[1].start_indices[0]).toEqual(1);
        expect(currentParseError.nodes[1].end_indices[0]).toEqual(3);
    });

    it('test creating tree from annotations without space between', () => {
        let documentString = 'AB';
        let mockAnnotations = [
            mockAnnotationNode('A', 0, 1, 1, annotationType, annotator),
            mockAnnotationNode('B', 1, 2, 2, annotationType, annotator)
        ];
        let rootNode = NestedSet.toTree(
            mockAnnotations,
            documentString,
            1,
            1,
            new Date(),
            errorCallBack);
        expect(rootNode).not.toBeNull();
        if(rootNode) {
            expect(rootNode.children.length).toEqual(1);
            // first node should be a line annotation
            let lineAnnotationNode = rootNode.children[0];
            expect(lineAnnotationNode.annotation_type.name).toEqual(NestedSet.LINE_ANNOTATION_TYPE_NAME);
            expect(lineAnnotationNode.children[0].start_indices[0]).toEqual(0);
            expect(lineAnnotationNode.children[0].end_indices[0]).toEqual(1);
            expect(lineAnnotationNode.children[1].start_indices[0]).toEqual(1);
            expect(lineAnnotationNode.children[1].end_indices[0]).toEqual(2);
        }
    });
});


describe('NestedSet.generateLineNodes(...)', () => {
    it('NestedSet.generateLineNodes()', () => {
        let document = `line1
line2
line3`;
        let lineNodes = NestedSet.generateLineAnnotationNodes(document, 1, 1, new Date());
        expect(lineNodes.length).toEqual(3);
        expect(lineNodes[0].start_indices[0]).toEqual(0);
        expect(lineNodes[0].end_indices[0]).toEqual(5);
        expect(lineNodes[1].start_indices[0]).toEqual(6);
        expect(lineNodes[1].end_indices[0]).toEqual(11);
        expect(lineNodes[2].start_indices[0]).toEqual(12);
        expect(lineNodes[2].end_indices[0]).toEqual(17);
    });
});

describe('NestedSet.trimWhiteSpaces(...)', () => {

    it('mock with whitespaces in the beginning and end', () => {
        let nodeWithWhiteSpace = new NestedSetNode(
            mockAnnotationNode('  A  ', 0, 5, 1, annotationType, annotator)
        );
        NestedSet.trimWithSpaces(nodeWithWhiteSpace);
        expect(nodeWithWhiteSpace.end_indices[0]).toEqual(3);
        expect(nodeWithWhiteSpace.start_indices[0]).toEqual(2);
    });

    it('mock with whitespaces in the beginning', () => {
        let nodeWithWhiteSpace = new NestedSetNode(
            mockAnnotationNode('  A', 0, 3, 1, annotationType, annotator)
        );
        NestedSet.trimWithSpaces(nodeWithWhiteSpace);
        expect(nodeWithWhiteSpace.start_indices[0]).toEqual(2);
        expect(nodeWithWhiteSpace.end_indices[0]).toEqual(3);
    });

    it('mock with whitespaces in the end', () => {
        let nodeWithWhiteSpace = new NestedSetNode(
            mockAnnotationNode('A   ', 0, 4, 1, annotationType, annotator)
        );
        NestedSet.trimWithSpaces(nodeWithWhiteSpace);
        expect(nodeWithWhiteSpace.start_indices[0]).toEqual(0);
        expect(nodeWithWhiteSpace.end_indices[0]).toEqual(1);
    });
});

describe('test json serialization', () => {
    it('test annotation json serialization', () => {
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



