import {describe, expect, test} from "@jest/globals";
import {Annotation} from "~/lib/model/annotation";
import {AnnotationType} from "~/lib/model/annotationType";
import {Annotator} from "~/lib/model/annotator";
import {NestedSet} from "~/lib/model/nestedset/nestedSet";
import {NestedSetParseError} from "~/lib/model/nestedset/nestedSetParseError";
import {NestedSetNode} from "~/lib/model/nestedset/nestedSetNode";
import exp from "constants";

describe('NestedSet.toTree(...)', () => {
    test('test calculating the tree', () => {

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

    test('test small example', () => {
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

    test('test creating tree from incorrect overlapping annotations', () => {

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

    test('test creating tree from annotations without space between', () => {
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
    })
});


describe('NestedSetNode.insertNode(...)', () => {
   test('testing inserting node into existing tree', () => {

       let documentString = 'AA BB CC DD EE';

       let mockAnnotations = [
           mockAnnotationNode('AA', 0, 2, 1, annotationType, annotator),
           mockAnnotationNode('CC DD EE', 6, 14, 2, annotationType, annotator),
           mockAnnotationNode('DD', 9, 11, 3, annotationType, annotator)
       ];

       let rootNode = NestedSet.toTree(
           mockAnnotations,
           documentString,
           1,
           1,
           new Date(),
           errorCallBack);


       // insert annotation 'EE' into node 'CC DD EE'
       let newAnnotation = new NestedSetNode(new Annotation({
           key: "",
           surface_forms: ['EE'],
           start_indices: [12],
           end_indices: [14],
           annotation_type: annotationType,
           annotator: annotator,
           run_id: 1,
           document_id: 1,
           metadata: [],
           timestamp: new Date(),
           _id: -1
       }));

       if(rootNode) {

           expect(rootNode.children[0].children.length).toEqual(3);

           let parentNode = rootNode.children[0].children[2];
           expect(parentNode.surface_forms[0]).toEqual('CC DD EE');

           // insert a new annotation
           parentNode.insertAnnotationNode(newAnnotation, errorCallBack);

           // check that the parent was set correctly
           expect(newAnnotation.parent).not.toBeNull();

           // check if child of root-node is correct, only child should be the line-node
           let lineNode = rootNode.children[0];
           expect(lineNode.children.length).toEqual(3);
           expect(lineNode.start_indices[0]).toEqual(0);
           expect(lineNode.end_indices[0]).toEqual(14);

           // child 'AA'
           expect(lineNode.children[0].start_indices[0]).toEqual(0);
           expect(lineNode.children[0].end_indices[0]).toEqual(2);

           // gap node ' BB '
           expect(lineNode.children[1].annotation_type.name).toEqual(NestedSet.GAP_ANNOTATION_TYPE_NAME);
           expect(lineNode.children[1].start_indices[0]).toEqual(2);
           expect(lineNode.children[1].end_indices[0]).toEqual(6);

           // node 'CC DD EE'
           let node2 = lineNode.children[2];
           expect(node2.start_indices[0]).toEqual(6);
           expect(node2.end_indices[0]).toEqual(14);
           expect(node2.children.length).toEqual(4);

           // gap node 'CC' that was calculated newly after inserting 'EE' as child of 'CC DD EE'
           expect(node2.children[0].surface_forms[0]).toEqual('CC ');
           expect(node2.children[0].start_indices[0]).toEqual(6);
           expect(node2.children[0].end_indices[0]).toEqual(9);

           // annotation 'DD'
           expect(node2.children[1].surface_forms[0]).toEqual('DD');
           expect(node2.children[1].start_indices[0]).toEqual(9);
           expect(node2.children[1].end_indices[0]).toEqual(11);

           // gap-annotation
           expect(node2.children[2].surface_forms[0]).toEqual(' ');
           expect(node2.children[2].start_indices[0]).toEqual(11);
           expect(node2.children[2].end_indices[0]).toEqual(12);

           // annotation 'EE' that was added after tree was rendered
           expect(node2.children[3].surface_forms[0]).toEqual('EE');
           expect(node2.children[3].start_indices[0]).toEqual(12);
           expect(node2.children[3].end_indices[0]).toEqual(14);


           // remove the annotation 'AA'
           parentNode = rootNode.children[0];
           parentNode.removeAnnotationNode(mockAnnotations[0], errorCallBack);
           expect(parentNode.children.length).toEqual(2);
           expect(parentNode.children[0].surface_forms[0]).toEqual('AA BB ');
           expect(parentNode.children[1].surface_forms[0]).toEqual('CC DD EE');
       }
   })
});



describe('NestedSet.generateLineNodes(...)', () => {
    test('NestedSet.generateLineNodes()', () => {
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

    test('mock with whitespaces in the beginning and end', () => {
        let nodeWithWhiteSpace = new NestedSetNode(
            mockAnnotationNode('  A  ', 0, 5, 1, annotationType, annotator)
        );
        NestedSet.trimWithSpaces(nodeWithWhiteSpace);
        expect(nodeWithWhiteSpace.end_indices[0]).toEqual(3);
        expect(nodeWithWhiteSpace.start_indices[0]).toEqual(2);
    });

    test('mock with whitespaces in the beginning', () => {
        let nodeWithWhiteSpace = new NestedSetNode(
            mockAnnotationNode('  A', 0, 3, 1, annotationType, annotator)
        );
        NestedSet.trimWithSpaces(nodeWithWhiteSpace);
        expect(nodeWithWhiteSpace.start_indices[0]).toEqual(2);
        expect(nodeWithWhiteSpace.end_indices[0]).toEqual(3);
    });

    test('mock with whitespaces in the end', () => {
        let nodeWithWhiteSpace = new NestedSetNode(
            mockAnnotationNode('A   ', 0, 4, 1, annotationType, annotator)
        );
        NestedSet.trimWithSpaces(nodeWithWhiteSpace);
        expect(nodeWithWhiteSpace.start_indices[0]).toEqual(0);
        expect(nodeWithWhiteSpace.end_indices[0]).toEqual(1);
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
    console.warn('the following nodes could not be parsed:');
    for (let node of parseError.nodes) {
        console.warn(`${node.surface_forms[0]}/(${node.start_indices[0]}:${node.end_indices[0]})`);
    }
    currentParseError = parseError;
};

function mockAnnotationNode(
    surfaceForm: string,
    start: number,
    end: number,
    id: number,
    annotationType: AnnotationType,
    annotator: Annotator): NestedSetNode {
    return new NestedSetNode(new Annotation({
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
    }));
}



