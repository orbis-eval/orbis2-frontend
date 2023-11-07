import { NestedSet } from "~/lib/model/nestedset/nestedSet";
import { NestedSetNode } from "~/lib/model/nestedset/nestedSetNode";

export class NestedSetNodeDeleter {
  public static deleteAnnotationNode(annotationToDelete: NestedSetNode) {
    const nodeToUpdate = this.getNodeToUpdate(annotationToDelete);
    const annotations = nodeToUpdate.allAnnotationNodes();
    this.deleteAnnotation(annotations, annotationToDelete);
    nodeToUpdate.children = []; // delete all childs before re-calculating the tree
    try {
      const rootNode = NestedSet.toTree(
        annotations,
        nodeToUpdate.surfaceForms[0],
        nodeToUpdate.runId,
        nodeToUpdate.documentId,
        nodeToUpdate.timestamp,
        nodeToUpdate,
        false,
      );
      nodeToUpdate.children = rootNode.children;
    } catch (e) {
      console.error("could not delete annotation in tree");
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
      if (annotation.id === idAnnotationToDelete.id) {
        // Deletes the value from the original array
        annotations.splice(index, 1);
        return true;
      }
      return false;
    });
  }
}
