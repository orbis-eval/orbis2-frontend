import { describe, expect, it } from "vitest";
import { Annotation } from "~/lib/model/annotation";
import { NestedSet } from "~/lib/model/nestedset/nestedSet";
import { NestedSetNode } from "~/lib/model/nestedset/nestedSetNode";
import {
  annotationType,
  annotator,
  mockAnnotationNode,
} from "~/tests/unit/lib/model/nestedset/nestedSetUtils";
import { NestedSetNodeInserter } from "~/lib/model/nestedset/nestedSetNodeInserter";

describe("NestedSetNodeInserter.insertAnnotationNode(...)", () => {
  it("testing inserting node into existing tree", () => {
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
    );

    // insert annotation 'EE' into node 'CC DD EE'
    const newAnnotation = new NestedSetNode(
      new Annotation({
        key: "",
        surfaceForms: ["EE"],
        startIndices: [12],
        endIndices: [14],
        annotationType,
        annotator,
        runId: 1,
        documentId: 1,
        metadata: [],
        timestamp: new Date(),
        _id: -1,
      }),
    );

    if (rootNode) {
      // insert a new annotation
      NestedSetNodeInserter.insertAnnotationNode(rootNode, newAnnotation);

      // check that the parent was set correctly
      expect(newAnnotation.parent).not.toBeNull();

      // check if child of root-node is correct, only child should be the line-node
      const lineNode = rootNode.children[0];
      expect(lineNode.children.length).toEqual(3);
      expect(lineNode.startIndices[0]).toEqual(0);
      expect(lineNode.endIndices[0]).toEqual(14);

      // child 'AA'
      expect(lineNode.children[0].startIndices[0]).toEqual(0);
      expect(lineNode.children[0].endIndices[0]).toEqual(2);

      // gap node ' BB '
      expect(lineNode.children[1].annotationType.name).toEqual(
        NestedSet.GAP_ANNOTATION_TYPE_NAME,
      );
      expect(lineNode.children[1].startIndices[0]).toEqual(2);
      expect(lineNode.children[1].endIndices[0]).toEqual(6);

      // node 'CC DD EE'
      const node2 = lineNode.children[2];
      expect(node2.startIndices[0]).toEqual(6);
      expect(node2.endIndices[0]).toEqual(14);
      expect(node2.children.length).toEqual(4);

      // gap node 'CC' that was calculated newly after inserting 'EE' as child of 'CC DD EE'
      expect(node2.children[0].surfaceForms[0]).toEqual("CC ");
      expect(node2.children[0].startIndices[0]).toEqual(6);
      expect(node2.children[0].endIndices[0]).toEqual(9);

      // annotation 'DD'
      expect(node2.children[1].surfaceForms[0]).toEqual("DD");
      expect(node2.children[1].startIndices[0]).toEqual(9);
      expect(node2.children[1].endIndices[0]).toEqual(11);

      // gap-annotation
      expect(node2.children[2].surfaceForms[0]).toEqual(" ");
      expect(node2.children[2].startIndices[0]).toEqual(11);
      expect(node2.children[2].endIndices[0]).toEqual(12);

      // annotation 'EE' that was added after tree was rendered
      expect(node2.children[3].surfaceForms[0]).toEqual("EE");
      expect(node2.children[3].startIndices[0]).toEqual(12);
      expect(node2.children[3].endIndices[0]).toEqual(14);
    }
  });

  it("testing inserting node into a tree without annotations", () => {
    const documentString = "AA BB CC DD EE";

    const rootNode = NestedSet.toTree([], documentString, 1, 1, new Date());

    // insert annotation 'EE' into node 'CC DD EE'
    const newAnnotation = new NestedSetNode(
      new Annotation({
        key: "",
        surfaceForms: ["EE"],
        startIndices: [12],
        endIndices: [14],
        annotationType,
        annotator,
        runId: 1,
        documentId: 1,
        metadata: [],
        timestamp: new Date(),
        _id: -1,
      }),
    );

    if (rootNode) {
      // insert a new annotation
      NestedSetNodeInserter.insertAnnotationNode(rootNode, newAnnotation);

      // check that the parent was set correctly
      expect(newAnnotation.parent).not.toBeNull();

      // check if child of root-node is correct, only child should be the line-node
      const lineNode = rootNode.children[0];
      expect(lineNode.children.length).toEqual(2);
      expect(lineNode.startIndices[0]).toEqual(0);
      expect(lineNode.endIndices[0]).toEqual(14);

      // gap node ' EE '
      expect(lineNode.children[0].annotationType.name).toEqual(
        NestedSet.GAP_ANNOTATION_TYPE_NAME,
      );
      expect(lineNode.children[0].startIndices[0]).toEqual(0);
      expect(lineNode.children[0].endIndices[0]).toEqual(12);
      expect(lineNode.children[0].children.length).toEqual(0);
      // child 'EE'
      expect(lineNode.children[1].surfaceForms[0]).toEqual("EE");
      expect(lineNode.children[1].startIndices[0]).toEqual(12);
      expect(lineNode.children[1].endIndices[0]).toEqual(14);
      expect(lineNode.children[1].children.length).toEqual(0);
    }
  });
});
