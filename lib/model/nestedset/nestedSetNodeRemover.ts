import {Annotation} from "~/lib/model/annotation";

import {NestedSet} from "~/lib/model/nestedset/nestedSet";
import {NestedSetParseError} from "~/lib/model/nestedset/nestedSetParseError";
import {NestedSetNode} from "~/lib/model/nestedset/nestedSetNode";

export class NestedSetNodeRemover {


    public static removeAnnotationNode(annotationToRemove: NestedSetNode,
                                       errorCallback: (parseError: NestedSetParseError) => void) {
        let nodeToUpdate = this.getNodeToUpdate(annotationToRemove);
        let annotations = nodeToUpdate.allAnnotationNodes();
        annotations = this.removeAnnotation(annotations, annotationToRemove);
        nodeToUpdate.children = []; // remove all childs before re-calculating the tree
        let rootNode = NestedSet.toTree(
            annotations,
            nodeToUpdate.surface_forms[0],
            nodeToUpdate.run_id,
            nodeToUpdate.document_id,
            nodeToUpdate.timestamp,
            errorCallback,
            nodeToUpdate,
            false);
        if (rootNode) {
            nodeToUpdate.children = rootNode.children;
        }
    }

    private static getNodeToUpdate(annotationToRemove: NestedSetNode): NestedSetNode {
        if (annotationToRemove.parent) {
            return annotationToRemove.parent;
        }
        return annotationToRemove;
    }

    private static removeAnnotation(annotations: NestedSetNode[], idAnnotationToRemove: NestedSetNode): NestedSetNode[] {
        annotations.filter((annotation, index, annotations) => {
            if (annotation._id === idAnnotationToRemove._id) {
                // Removes the value from the original array
                annotations.splice(index, 1);
                return true;
            }
            return false;
        });
        return annotations;
    }
}
