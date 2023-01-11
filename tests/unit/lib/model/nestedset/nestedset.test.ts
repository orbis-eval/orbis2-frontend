import {describe, expect, test} from "@jest/globals";
import {Annotation} from "~/lib/model/annotation";
import {AnnotationType} from "~/lib/model/annotationType";
import {Annotator} from "~/lib/model/annotator";
import {NestedSetNode} from "~/lib/model/nestedset/nestedSetNode";

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
            new Annotation({
                key: "",
                surface_forms: ['HH'],
                start_indices: [21],
                end_indices: [23],
                annotation_type: annotationType,
                annotator: annotator,
                run_id: 1,
                document_id: 1,
                metadata: [],
                timestamp: new Date(),
                _id: 1
            }),
            new Annotation({
                key: "",
                surface_forms: ['AA'],
                start_indices: [0],
                end_indices: [2],
                annotation_type: annotationType,
                annotator: new Annotator({
                    name: "test annotator",
                    roles: [],
                    _id: 1
                }),
                run_id: 1,
                document_id: 1,
                metadata: [],
                timestamp: new Date(),
                _id: 1
            }),
            new Annotation({
                key: "",
                surface_forms: ['CC DD EE'],
                start_indices: [6],
                end_indices: [14],
                annotation_type: annotationType,
                annotator: annotator,
                run_id: 1,
                document_id: 1,
                metadata: [],
                timestamp: new Date(),
                _id: 1
            }),
            new Annotation({
                key: "",
                surface_forms: ['DD'],
                start_indices: [9],
                end_indices: [11],
                annotation_type: annotationType,
                annotator: annotator,
                run_id: 1,
                document_id: 1,
                metadata: [],
                timestamp: new Date(),
                _id: 1
            }),
            new Annotation({
                key: "",
                surface_forms: ['FF GG'],
                start_indices: [15],
                end_indices: [20],
                annotation_type: annotationType,
                annotator: annotator,
                run_id: 1,
                document_id: 1,
                metadata: [],
                timestamp: new Date(),
                _id: 1
            }),
            new Annotation({
                key: "",
                surface_forms: ['GG'],
                start_indices: [18],
                end_indices: [20],
                annotation_type: annotationType,
                annotator: annotator,
                run_id: 1,
                document_id: 1,
                metadata: [],
                timestamp: new Date(),
                _id: 1
            }),
            new Annotation({
                key: "",
                surface_forms: ['HH II'],
                start_indices: [21],
                end_indices: [26],
                annotation_type: annotationType,
                annotator: annotator,
                run_id: 1,
                document_id: 1,
                metadata: [],
                timestamp: new Date(),
                _id: 1
            })
        ];

        let getParent = (potentialParent: NestedSetNode, nodeUnderCheck: NestedSetNode): NestedSetNode | null => {
            if (nodeUnderCheck.left >= potentialParent.left && nodeUnderCheck.right <= potentialParent.right) {
                return potentialParent;
            }
            return (potentialParent.parent) ? getParent(potentialParent.parent, nodeUnderCheck) : null;
        };

        expect(mockAnnotations.length).toEqual(7);

        // 1. start with a set of all annotations sorted by start-index
        mockAnnotations.sort((a: Annotation, b: Annotation) => {
            if (a.start_indices[0] == b.start_indices[0]) {
                return b.end_indices[0] - a.end_indices[0];
            }
            return a.start_indices[0] - b.start_indices[0];
        });

        // 2. the first node is a root add it as the root of the tree move to next node
        // the root is the start/end of the full content-string

        let depth: number = 0;

        let rootNode = new NestedSetNode(
            documentContent,
            0,
            documentContent.length,
            depth
        );

        let previousNode = rootNode;

        expect(documentContent.substring(rootNode.left, rootNode.right))
            .toEqual(documentContent);

        // iterate all annotations
        for (let annotation of mockAnnotations) {

            let start = annotation.start_indices[0];
            let end = annotation.end_indices[0];
            let surfaceForm = annotation.surface_forms[0];

            let currentNode = new NestedSetNode(
                surfaceForm,
                start,
                end,
                depth
            );

            let parentNode = getParent(previousNode, currentNode);

            if (parentNode) {
                parentNode.append(currentNode);
            } else {
                // exception
            }

            previousNode = currentNode;
            // console.log(`current node:(${currentNode.left}:${currentNode.right}), depth: ${currentNode.depth}`);

            //console.log(annotation.start_indices[0])
            // check if given surfaceform and string given by start/end match
            expect(documentContent.substring(start, end))
                .toEqual(surfaceForm);
        }


        expect(rootNode.children.length)
            .toEqual(4);

        for (let node of rootNode.rebuild()) {
            console.log(`node:(${node.left}:${node.right})`);
        }

    });

});



