import {NestedSetNode} from "~/lib/model/nestedset/nestedSetNode";
import {Annotation} from "~/lib/model/annotation";
import {AnnotationType} from "~/lib/model/annotationType";
import {Annotator} from "~/lib/model/annotator";
import {NestedSetParseError} from "~/lib/model/nestedset/nestedSetParseError";

export class NestedSet {

    public static readonly GAP_ANNOTATION_KEY = "GAP_ANNOTATION_KEY";
    public static readonly LINE_ANNOTATION_KEY = "LINE_ANNOTATION_KEY";
    public static readonly NESTEDSET_ANNOTATOR_NAME = "NESTEDSET_ANNOTATOR";
    public static readonly GAP_ANNOTATION_TYPE_NAME = "GAP_ANNOTATION";

    public static readonly LINE_ANNOTATION_TYPE_NAME = "LINE_ANNOTATION";

    public static GAP_ANNOTATION_TYPE = new AnnotationType({
        name: this.GAP_ANNOTATION_TYPE_NAME,
        _id: 1000
    });

    public static LINE_ANNOTATION_TYPE = new AnnotationType({
        name: this.LINE_ANNOTATION_TYPE_NAME,
        _id: 1001
    });

    public static NESTED_SET_ANNOTATOR = new Annotator({
        name: this.NESTEDSET_ANNOTATOR_NAME,
        roles: [],
        _id: 1001
    });

    public static ROOT_ANNOTATION_TYPE = new AnnotationType({
        name: "ROOT_NODE_ANNOTATION",
        _id: 4000
    });

    public static ROOT_ANNOTATOR = new Annotator({
        name: this.NESTEDSET_ANNOTATOR_NAME,
        roles: [],
        _id: 1001
    });

    static annotationCompare = (a: Annotation, b: Annotation) => {
        if (a.start_indices[0] == b.start_indices[0]) {
            return b.end_indices[0] - a.end_indices[0];
        }
        return a.start_indices[0] - b.start_indices[0];
    };

    static toTree(
        annotations: Annotation[],
        documentString: string,
        runId: number,
        documentId: number,
        timestamp: Date,
        errorCallback: (parseError: NestedSetParseError) => void): NestedSetNode | null {

        // remove all existing line-annotations and calculate the, then add them to the existing annotations
        annotations = annotations.filter((node) => {
            return node.annotation_type.name !== NestedSet.LINE_ANNOTATION_TYPE_NAME;
        });

        //push all line-annotations
        annotations.push(...this.generateLineAnnotations(documentString, runId, documentId, timestamp));

        // sort the annotations
        annotations.sort(this.annotationCompare);

        let rootNode = new NestedSetNode(
            new Annotation({
                key: "",
                surface_forms: [documentString],
                start_indices: [0],
                end_indices: [documentString.length],
                annotation_type: this.ROOT_ANNOTATION_TYPE,
                annotator: this.ROOT_ANNOTATOR,
                run_id: runId,
                document_id: documentId,
                metadata: [],
                timestamp: timestamp,
                _id: -1
            })
        );

        let previousNode = rootNode;

        // iterate all annotations
        for (let annotation of annotations) {
            let currentNode = new NestedSetNode(annotation);
            let parentNode = this.getParent(previousNode, currentNode, errorCallback);
            if (parentNode) {
                parentNode.addChild(currentNode);
            } else {
                // tree could not be constructed, so return null
                return null;
            }
            previousNode = currentNode;
        }
        this.calculateGapAnnotations(rootNode);
        return rootNode;
    }

    static getParent = (
        potentialParent: NestedSetNode,
        nodeUnderCheck: NestedSetNode,
        errorCallback: (parseError: NestedSetParseError) => void): NestedSetNode | null => {
        if (
            nodeUnderCheck.start_indices[0] >= potentialParent.start_indices[0]
            &&
            nodeUnderCheck.start_indices[0] < potentialParent.end_indices[0]) {
            if (nodeUnderCheck.end_indices[0] <= potentialParent.end_indices[0]) {
                return potentialParent;
            } else {
                errorCallback(new NestedSetParseError([potentialParent, nodeUnderCheck], 'detected invalid annotations while creating tree'));
                return null;
            }
        }
        return (potentialParent.parent) ? this.getParent(potentialParent.parent, nodeUnderCheck, errorCallback) : null;
    };

    static calculateGapAnnotations = (node: NestedSetNode) => {
        let gapStart = 0;
        let gapAnnotations: NestedSetNode[] = [];
        for (let childNode of node.children) {
            // determine if we have a gap to the next annotation.
            // if yes, generate an annotation of type "GAP"
            if (childNode.start_indices[0] > gapStart) {
                let surfaceForm = node.surface_forms[0].substring(gapStart, childNode.start_indices[0] - node.start_indices[0]);
                let gapAnnotation = this.addGapAnnotation(surfaceForm, gapStart + node.start_indices[0], childNode.start_indices[0], childNode);
                gapAnnotations.push(gapAnnotation);
                gapStart = childNode.end_indices[0] - node.start_indices[0];
            } else {
                gapStart = childNode.end_indices[0] - node.start_indices[0];
            }
            // call function for the child
            this.calculateGapAnnotations(childNode);
        }
        if ((node.children.length > 0) && (gapStart < node.end_indices[0])) {
            let surfaceForm = node.surface_forms[0].substring(gapStart, node.end_indices[0]);
            let gapAnnotation = this.addGapAnnotation(surfaceForm, gapStart + node.start_indices[0], node.end_indices[0], node);
            gapAnnotations.push(gapAnnotation);
        }
        // add all new gap-annotations to the parent
        for (let gapAnnotation of gapAnnotations) {
            node.addChild(gapAnnotation);
        }
        // sort the children
        node.children.sort(this.annotationCompare);
    };

    public static generateLineAnnotations = (
        document: string,
        runId: number,
        documentId: number,
        timeStamp: Date): Annotation[] => {
        const lines = document.split("\n");
        let offset = 0;
        let lineNodes: Annotation[] = [];
        lines.forEach((line) => {
            lineNodes.push(new Annotation({
                key: this.LINE_ANNOTATION_KEY,
                surface_forms: [line],
                start_indices: [offset],
                end_indices: [line.length + offset],
                annotation_type: this.LINE_ANNOTATION_TYPE,
                annotator: this.NESTED_SET_ANNOTATOR,
                run_id: runId,
                document_id: documentId,
                metadata: [],
                timestamp: timeStamp,
                _id: offset
            }));
            offset = offset + line.length + 1;
        });
        return lineNodes;
    };

    public static trimWithSpaces(annotation: Annotation): Annotation {
        let surfaceForm = annotation.surface_forms[0];
        let endChar = surfaceForm.charAt(surfaceForm.length - 1);
        if (endChar === ' ') {
            surfaceForm = surfaceForm.substring(0, surfaceForm.length - 1);
            annotation.end_indices[0] = annotation.end_indices[0] - 1;
            annotation.surface_forms[0] = surfaceForm;
            return (this.trimWithSpaces(annotation));
        }
        let startChar = surfaceForm.charAt(0);
        if (startChar === ' ') {
            surfaceForm = surfaceForm.substring(1, surfaceForm.length);
            annotation.start_indices[0] = annotation.start_indices[0] + 1;
            annotation.surface_forms[0] = surfaceForm;
            return (this.trimWithSpaces(annotation));
        }
        return annotation;
    }

    private static addGapAnnotation(
        surfaceForm: string,
        gapStart: number,
        gapEnd: number,
        childNode: NestedSetNode): NestedSetNode {
        return new NestedSetNode({
            key: this.GAP_ANNOTATION_KEY,
            surface_forms: [surfaceForm],
            start_indices: [gapStart],
            end_indices: [gapEnd],
            annotation_type: this.GAP_ANNOTATION_TYPE,
            annotator: this.NESTED_SET_ANNOTATOR,
            run_id: childNode.run_id,
            document_id: childNode.document_id,
            metadata: [],
            timestamp: childNode.timestamp,
            _id: 2000
        });
    }
}
