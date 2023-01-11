import {NestedSetNode} from "~/lib/model/nestedset/nestedSetNode";
import {Annotation} from "~/lib/model/annotation";
import {AnnotationType} from "~/lib/model/annotationType";
import {Annotator} from "~/lib/model/annotator";

export class NestedSet {

    public static readonly GAP_ANNOTATION_KEY = "GAP_ANNOTATION_KEY";
    public static readonly GAP_ANNOTATOR_NAME = "NESTEDSET_ANNOTATOR";
    public static readonly GAP_ANNOTATION_TYPE_NAME = "GAP_ANNOTATION";

    public static GAP_ANNOTATION_TYPE = new AnnotationType({
        name: this.GAP_ANNOTATION_TYPE_NAME,
        _id: 1000
    });

    public static NESTED_SET_ANNOTATOR = new Annotator({
        name: this.GAP_ANNOTATOR_NAME,
        roles: [],
        _id: 1001
    });

    static toTree(
        annotations: Annotation[],
        documentString: string,
        annotationType: AnnotationType,
        annotator: Annotator,
        runId: number,
        documentId: number,
        timestamp: Date,
        id: number): NestedSetNode {

        // sort annotations start-index and then smaller end-indexes first if start-index is the same
        annotations.sort((a: Annotation, b: Annotation) => {
            if (a.start_indices[0] == b.start_indices[0]) {
                return b.end_indices[0] - a.end_indices[0];
            }
            return a.start_indices[0] - b.start_indices[0];
        });

        let rootNode = new NestedSetNode(
            new Annotation({
                key: "",
                surface_forms: [documentString],
                start_indices: [0],
                end_indices: [documentString.length],
                annotation_type: annotationType,
                annotator: annotator,
                run_id: runId,
                document_id: documentId,
                metadata: [],
                timestamp: timestamp,
                _id: id
            })
        );

        let previousNode = rootNode;
        let gapStart = 0;

        // iterate all annotations
        for (let annotation of annotations) {
            let currentNode = new NestedSetNode(annotation);
            let parentNode = this.getParent(previousNode, currentNode);

            // determine if we have a gap to the next annotation.
            // if yes, generate an annotation of type "GAP"
            if (parentNode === rootNode && currentNode.start_indices[0] > gapStart) {
                let surfaceForm = documentString.substring(gapStart, currentNode.start_indices[0])
                    .trim(); // trim whitespaces
                // only add gap-annotation if it is not an empty string after trimming
                if (surfaceForm) {
                    let gapAnnotation = new NestedSetNode({
                        key: this.GAP_ANNOTATION_KEY,
                        surface_forms: [surfaceForm],
                        start_indices: [gapStart],
                        end_indices: [currentNode.start_indices[0]],
                        annotation_type: this.GAP_ANNOTATION_TYPE,
                        annotator: this.NESTED_SET_ANNOTATOR,
                        run_id: annotation.run_id,
                        document_id: annotation.document_id,
                        metadata: [],
                        timestamp: annotation.timestamp,
                        _id: 2000
                    });
                    // add the gap-annotation to the root-node
                    rootNode.append(gapAnnotation);
                }
                gapStart = currentNode.start_indices[0];
            } else {
                gapStart = currentNode.end_indices[0];
            }
            // at the node to its parent
            if (parentNode) {
                parentNode.append(currentNode);
            } else {
                // TODO: handle exception, this should not occur with proper annotation data
            }
            previousNode = currentNode;
        }
        return rootNode;
    }

    static getParent = (potentialParent: NestedSetNode, nodeUnderCheck: NestedSetNode): NestedSetNode | null => {
        if (nodeUnderCheck.start_indices[0] >= potentialParent.start_indices[0]
            && nodeUnderCheck.end_indices[0] <= potentialParent.end_indices[0]) {
            return potentialParent;
        }
        return (potentialParent.parent) ? this.getParent(potentialParent.parent, nodeUnderCheck) : null;
    };
}
