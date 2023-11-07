import { NestedSet } from "~/lib/model/nestedset/nestedSet";
import { NestedSetNode } from "~/lib/model/nestedset/nestedSetNode";

export class NestedSetNodeInserter {
  public static insertAnnotationNode(
    rootNode: NestedSetNode,
    nodeToInsert: NestedSetNode,
  ) {
    if (
      rootNode.children.length === 1 &&
      rootNode.children[0].key === NestedSet.LINE_ANNOTATION_KEY
    ) {
      const nodeToUpdate = this.findParentNode(rootNode, nodeToInsert);
      if (nodeToUpdate) {
        const annotationNodes = nodeToUpdate.allAnnotationNodes();
        nodeToInsert.parent = nodeToUpdate;
        annotationNodes.push(nodeToInsert);
        nodeToUpdate.children = [];
        try {
          const newParentNode = NestedSet.toTree(
            annotationNodes,
            nodeToUpdate.surfaceForms[0],
            nodeToUpdate.runId,
            nodeToUpdate.documentId,
            nodeToUpdate.timestamp,
            nodeToUpdate,
            false,
          );
          nodeToUpdate.children = newParentNode.children;
          for (const child of nodeToUpdate.children) {
            child.parent = nodeToUpdate;
          }
        } catch (e) {
          console.warn("could not insert annotation");
        }
      }
    } else {
      console.error("Missing line annotation in root node");
    }
  }

  private static findParentNode(
    node: NestedSetNode,
    nodeToInsert: NestedSetNode,
  ): NestedSetNode {
    for (const child of node.children) {
      if (
        child.startIndices[0] <= nodeToInsert.startIndices[0] &&
        child.endIndices[0] >= nodeToInsert.endIndices[0]
      ) {
        return this.findParentNode(child, nodeToInsert);
      }
    }
    if (node.parent?.parent == null) {
      return node;
    }
    return node.parent;
  }
}
