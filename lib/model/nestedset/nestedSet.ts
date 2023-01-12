import {NestedSetNode} from "~/lib/model/nestedset/nestedSetNode";
import {Annotation} from "~/lib/model/annotation";
import {AnnotationType} from "~/lib/model/annotationType";
import {Annotator} from "~/lib/model/annotator";
import AnnotationNode from "~/components/annotationNode.vue";

export class NestedSet {

    public static readonly GAP_ANNOTATION_KEY = "GAP_ANNOTATION_KEY";
    public static readonly NESTEDSET_ANNOTATOR_NAME = "NESTEDSET_ANNOTATOR";
    public static readonly GAP_ANNOTATION_TYPE_NAME = "GAP_ANNOTATION";

    public static GAP_ANNOTATION_TYPE = new AnnotationType({
        name: this.GAP_ANNOTATION_TYPE_NAME,
        _id: 1000
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
        timestamp: Date): NestedSetNode {

        // sort annotations start-index and then smaller end-indexes first if start-index is the same
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
            let parentNode = this.getParent(previousNode, currentNode);
            if (parentNode) {
                parentNode.append(currentNode);
            } else {
                // TODO: handle exception, this should not occur with proper annotation data
            }
            previousNode = currentNode;
        }

        this.calculateGapAnnotations(rootNode);

        return rootNode;
    }

    static getParent = (potentialParent: NestedSetNode, nodeUnderCheck: NestedSetNode): NestedSetNode | null => {
        if (nodeUnderCheck.start_indices[0] >= potentialParent.start_indices[0]
            && nodeUnderCheck.end_indices[0] <= potentialParent.end_indices[0]) {
            return potentialParent;
        }
        return (potentialParent.parent) ? this.getParent(potentialParent.parent, nodeUnderCheck) : null;
    };

    static calculateGapAnnotations = (node: NestedSetNode) => {
        let gapStart = 0;
        let gapAnnotations: NestedSetNode[] = [];
        for (let childNode of node.children) {
            // determine if we have a gap to the next annotation.
            // if yes, generate an annotation of type "GAP"
            if (childNode.start_indices[0] > gapStart) {
                let surfaceForm = node.surface_forms[0].substring(gapStart, childNode.start_indices[0]-node.start_indices[0]);
                let gapAnnotation = this.addGapAnnotation(surfaceForm, gapStart+node.start_indices[0], childNode.start_indices[0], childNode);
                // add the gap-annotation to the root-node
                gapAnnotations.push(gapAnnotation);
                gapStart = childNode.end_indices[0]-node.start_indices[0];
            } else {
                gapStart = childNode.end_indices[0]-node.start_indices[0];
            }
            // call function for the child
            this.calculateGapAnnotations(childNode);
        }
        if ((node.children.length>0) && (gapStart < node.end_indices[0])) {
            let surfaceForm = node.surface_forms[0].substring(gapStart, node.end_indices[0]);
            let gapAnnotation = this.addGapAnnotation(surfaceForm, gapStart+node.start_indices[0], node.end_indices[0], node);
            gapAnnotations.push(gapAnnotation);
        }
        // add all new gap-annotations to the parent
        for (let gapAnnotation of gapAnnotations) {
            node.append(gapAnnotation);
        }
        // sort the children
        node.children.sort(this.annotationCompare);
    };

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
