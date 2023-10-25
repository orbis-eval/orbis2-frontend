import { describe, expect, it } from "vitest";
import { Annotation } from "~/lib/model/annotation";
import { NestedSet } from "~/lib/model/nestedset/nestedSet";
import { NestedSetNode } from "~/lib/model/nestedset/nestedSetNode";
import {
  annotationType,
  annotator,
  errorCallBack,
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
      errorCallBack,
    );

    // insert annotation 'EE' into node 'CC DD EE'
    const newAnnotation = new NestedSetNode(
      new Annotation({
        key: "",
        surface_forms: ["EE"],
        start_indices: [12],
        end_indices: [14],
        annotation_type: annotationType,
        annotator,
        run_id: 1,
        document_id: 1,
        metadata: [],
        timestamp: new Date(),
        _id: -1,
      }),
    );

    if (rootNode) {
      // insert a new annotation
      NestedSetNodeInserter.insertAnnotationNode(
        rootNode,
        newAnnotation,
        errorCallBack,
      );

      // check that the parent was set correctly
      expect(newAnnotation.parent).not.toBeNull();

      // check if child of root-node is correct, only child should be the line-node
      const lineNode = rootNode.children[0];
      expect(lineNode.children.length).toEqual(3);
      expect(lineNode.start_indices[0]).toEqual(0);
      expect(lineNode.end_indices[0]).toEqual(14);

      // child 'AA'
      expect(lineNode.children[0].start_indices[0]).toEqual(0);
      expect(lineNode.children[0].end_indices[0]).toEqual(2);

      // gap node ' BB '
      expect(lineNode.children[1].annotation_type.name).toEqual(
        NestedSet.GAP_ANNOTATION_TYPE_NAME,
      );
      expect(lineNode.children[1].start_indices[0]).toEqual(2);
      expect(lineNode.children[1].end_indices[0]).toEqual(6);

      // node 'CC DD EE'
      const node2 = lineNode.children[2];
      expect(node2.start_indices[0]).toEqual(6);
      expect(node2.end_indices[0]).toEqual(14);
      expect(node2.children.length).toEqual(4);

      // gap node 'CC' that was calculated newly after inserting 'EE' as child of 'CC DD EE'
      expect(node2.children[0].surface_forms[0]).toEqual("CC ");
      expect(node2.children[0].start_indices[0]).toEqual(6);
      expect(node2.children[0].end_indices[0]).toEqual(9);

      // annotation 'DD'
      expect(node2.children[1].surface_forms[0]).toEqual("DD");
      expect(node2.children[1].start_indices[0]).toEqual(9);
      expect(node2.children[1].end_indices[0]).toEqual(11);

      // gap-annotation
      expect(node2.children[2].surface_forms[0]).toEqual(" ");
      expect(node2.children[2].start_indices[0]).toEqual(11);
      expect(node2.children[2].end_indices[0]).toEqual(12);

      // annotation 'EE' that was added after tree was rendered
      expect(node2.children[3].surface_forms[0]).toEqual("EE");
      expect(node2.children[3].start_indices[0]).toEqual(12);
      expect(node2.children[3].end_indices[0]).toEqual(14);
    }
  });

  it("testing inserting node into a tree without annotations", () => {
    const documentString = "AA BB CC DD EE";

    const rootNode = NestedSet.toTree(
      [],
      documentString,
      1,
      1,
      new Date(),
      errorCallBack,
    );

    // insert annotation 'EE' into node 'CC DD EE'
    const newAnnotation = new NestedSetNode(
      new Annotation({
        key: "",
        surface_forms: ["EE"],
        start_indices: [12],
        end_indices: [14],
        annotation_type: annotationType,
        annotator,
        run_id: 1,
        document_id: 1,
        metadata: [],
        timestamp: new Date(),
        _id: -1,
      }),
    );

    if (rootNode) {
      // insert a new annotation
      NestedSetNodeInserter.insertAnnotationNode(
        rootNode,
        newAnnotation,
        errorCallBack,
      );

      // check that the parent was set correctly
      expect(newAnnotation.parent).not.toBeNull();

      // check if child of root-node is correct, only child should be the line-node
      const lineNode = rootNode.children[0];
      expect(lineNode.children.length).toEqual(2);
      expect(lineNode.start_indices[0]).toEqual(0);
      expect(lineNode.end_indices[0]).toEqual(14);

      // gap node ' EE '
      expect(lineNode.children[0].annotation_type.name).toEqual(
        NestedSet.GAP_ANNOTATION_TYPE_NAME,
      );
      expect(lineNode.children[0].start_indices[0]).toEqual(0);
      expect(lineNode.children[0].end_indices[0]).toEqual(12);
      expect(lineNode.children[0].children.length).toEqual(0);
      // child 'EE'
      expect(lineNode.children[1].surface_forms[0]).toEqual("EE");
      expect(lineNode.children[1].start_indices[0]).toEqual(12);
      expect(lineNode.children[1].end_indices[0]).toEqual(14);
      expect(lineNode.children[1].children.length).toEqual(0);
    }
  });
});
