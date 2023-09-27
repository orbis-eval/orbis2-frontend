import {describe, expect, test} from "@jest/globals";
import {Annotation} from "~/lib/model/annotation";
import {AnnotationType} from "~/lib/model/annotationType";
import {Annotator} from "~/lib/model/annotator";
import {NestedSet} from "~/lib/model/nestedset/nestedSet";
import {NestedSetParseError} from "~/lib/model/nestedset/nestedSetParseError";
import {NestedSetNode} from "~/lib/model/nestedset/nestedSetNode";

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

let annotationType: AnnotationType = new AnnotationType({
    name: "A Type",
    color_id: 1,
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



