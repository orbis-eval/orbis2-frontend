import { describe, expect, it } from "vitest";
import { NestedSet } from "~/lib/model/nestedset/nestedSet";
import {
  annotationType,
  annotator,
  errorCallBack,
  mockAnnotationNode,
} from "~/tests/unit/lib/model/nestedset/nestedSetUtils";
import { NestedSetNodeDeleter } from "~/lib/model/nestedset/nestedSetNodeDeleter";

describe("NestedSetNodeDeleter.deleteAnnotationNode(...)", () => {
  it("testing delete node", () => {
    const documentString = "AA BB CC DD EE";

    const mockAnnotations = [
      mockAnnotationNode("AA", 0, 2, 1, annotationType, annotator),
      mockAnnotationNode("CC DD EE", 6, 14, 2, annotationType, annotator),
      mockAnnotationNode("DD", 9, 11, 3, annotationType, annotator),
    ];

    const rootNode = NestedSet.toTree(
      mockAnnotations,
      documentString,
      1,
      1,
      new Date(),
      errorCallBack,
    );

    if (rootNode) {
      // dekete a new annotation
      const annotationToDelete = rootNode.children[0].children[2];
      NestedSetNodeDeleter.deleteAnnotationNode(
        annotationToDelete,
        errorCallBack,
      );

      // check if child of root-node is correct, only child should be the line-node
      const lineNode = rootNode.children[0];
      expect(lineNode.children.length).toEqual(4);
      expect(lineNode.startIndices[0]).toEqual(0);
      expect(lineNode.endIndices[0]).toEqual(14);

      // child 'AA'
      expect(lineNode.children[0].startIndices[0]).toEqual(0);
      expect(lineNode.children[0].endIndices[0]).toEqual(2);

      // gap node ' AA to DD '
      expect(lineNode.children[1].annotationType.name).toEqual(
        NestedSet.GAP_ANNOTATION_TYPE_NAME,
      );
      expect(lineNode.children[1].startIndices[0]).toEqual(2);
      expect(lineNode.children[1].endIndices[0]).toEqual(9);

      // child 'DD'
      expect(lineNode.children[2].startIndices[0]).toEqual(9);
      expect(lineNode.children[2].endIndices[0]).toEqual(11);

      // gap node ' DD to End'
      expect(lineNode.children[3].annotationType.name).toEqual(
        NestedSet.GAP_ANNOTATION_TYPE_NAME,
      );
      expect(lineNode.children[3].startIndices[0]).toEqual(11);
      expect(lineNode.children[3].endIndices[0]).toEqual(14);
    }
  });
});
