import { NestedSet } from "~/lib/model/nestedset/nestedSet";
import { NestedSetParseError } from "~/lib/model/nestedset/nestedSetParseError";
import { NestedSetNode } from "~/lib/model/nestedset/nestedSetNode";

export class NestedSetNodeDeleter {
  public static deleteAnnotationNode(
    annotationToDelete: NestedSetNode,
    errorCallback: (parseError: NestedSetParseError) => void,
  ) {
    const nodeToUpdate = this.getNodeToUpdate(annotationToDelete);
    const annotations = nodeToUpdate.allAnnotationNodes();
    this.deleteAnnotation(annotations, annotationToDelete);
    nodeToUpdate.children = []; // delete all childs before re-calculating the tree
    const rootNode = NestedSet.toTree(
      annotations,
      nodeToUpdate.surface_forms[0],
      nodeToUpdate.run_id,
      nodeToUpdate.document_id,
      nodeToUpdate.timestamp,
      errorCallback,
      nodeToUpdate,
      false,
    );
    if (rootNode) {
      nodeToUpdate.children = rootNode.children;
    }
  }

  private static getNodeToUpdate(
    annotationToDelete: NestedSetNode,
  ): NestedSetNode {
    if (annotationToDelete.parent) {
      return annotationToDelete.parent;
    }
    return annotationToDelete;
  }

  private static deleteAnnotation(
    annotations: NestedSetNode[],
    idAnnotationToDelete: NestedSetNode,
  ) {
    annotations.filter((annotation, index, annotations) => {
      if (annotation._id === idAnnotationToDelete._id) {
        // Deletes the value from the original array
        annotations.splice(index, 1);
        return true;
      }
      return false;
    });
  }
}
