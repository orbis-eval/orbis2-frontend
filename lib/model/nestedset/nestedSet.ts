import {NestedSetNode} from "~/lib/model/nestedset/nestedSetNode";
import {Annotation} from "~/lib/model/annotation";
import {AnnotationType} from "~/lib/model/annotationType";
import {Annotator} from "~/lib/model/annotator";

export class NestedSet {

    static toTree(
        annotations: Annotation[],
        documentString: string,
        annotationType: AnnotationType,
        annotator: Annotator,
        runId: number,
        documentId: number,
        timestamp: Date,
        id: number):NestedSetNode {

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
        // iterate all annotations
        for (let annotation of annotations) {
            let currentNode = new NestedSetNode(annotation);
            let parentNode = this.getParent(previousNode, currentNode);
            if (parentNode) {
                parentNode.append(currentNode);
            } else {
                // TODO: handle exception
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
