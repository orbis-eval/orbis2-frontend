import { describe, expect, it } from "vitest";
import { NestedSet } from "~/lib/model/nestedset/nestedSet";
import { NestedSetNode } from "~/lib/model/nestedset/nestedSetNode";
import {
  annotationType,
  annotator,
  currentParseError,
  errorCallBack,
  mockAnnotationNode,
} from "~/tests/unit/lib/model/nestedset/nestedSetUtils";

describe("NestedSet.toTree(...)", () => {
  it("test calculating the tree", () => {
    const mockAnnotationNodes: NestedSetNode[] = [
      mockAnnotationNode("AABB", 0, 4, 1, annotationType, annotator),
      mockAnnotationNode("AA", 0, 2, 2, annotationType, annotator),
      mockAnnotationNode("A", 0, 1, 3, annotationType, annotator),
      mockAnnotationNode("DD", 6, 8, 4, annotationType, annotator),
    ];
    // calculate the tree
    const rootNode = NestedSet.toTree(
      mockAnnotationNodes,
      "AABBCCDDEE",
      1,
      1,
      new Date(),
      errorCallBack,
    );
    expect(rootNode).not.toBeNull();
    if (rootNode) {
      // first child has to be a line annotation
      expect(rootNode.children.length).toEqual(1);

      // the only children of root should be a line annotation
      const lineAnnotationNode = rootNode.children[0];
      expect(lineAnnotationNode.annotationType.name).toEqual(
        NestedSet.LINE_ANNOTATION_TYPE_NAME,
      );

      // check the gap-annotations in the line-node
      expect(lineAnnotationNode.children[1].annotationType.name).toEqual(
        NestedSet.GAP_ANNOTATION_TYPE_NAME,
      );
      expect(lineAnnotationNode.children[1].startIndices[0]).toEqual(4);
      expect(lineAnnotationNode.children[1].endIndices[0]).toEqual(6);
      expect(lineAnnotationNode.children[3].annotationType.name).toEqual(
        NestedSet.GAP_ANNOTATION_TYPE_NAME,
      );
      expect(lineAnnotationNode.children[3].startIndices[0]).toEqual(8);
      expect(lineAnnotationNode.children[3].endIndices[0]).toEqual(10);

      // check the node "AABB"
      expect(lineAnnotationNode.children[0].id).toEqual(
        mockAnnotationNodes[0].id,
      );
      // check the childs of "AABB"
      expect(lineAnnotationNode.children[0].children[0].id).toEqual(
        mockAnnotationNodes[1].id,
      );
      expect(
        lineAnnotationNode.children[0].children[1].annotationType.name,
      ).toEqual(NestedSet.GAP_ANNOTATION_TYPE_NAME);

      // check the childs of "AA"
      expect(lineAnnotationNode.children[0].children[0].children[0].id).toEqual(
        mockAnnotationNodes[2].id,
      );
      expect(
        lineAnnotationNode.children[0].children[0].children[0].children.length,
      ).toEqual(0);
      // check the gap annotation
      expect(
        lineAnnotationNode.children[0].children[0].children[1].startIndices[0],
      ).toEqual(1);
      expect(
        lineAnnotationNode.children[0].children[0].children[1].endIndices[0],
      ).toEqual(2);

      // check annotation "DD"
      expect(lineAnnotationNode.children[2].id).toEqual(
        mockAnnotationNodes[3].id,
      );
      expect(lineAnnotationNode.children[2].children.length).toEqual(0);
    }
  });

  it("test small example", () => {
    const mockAnnotations = [
      mockAnnotationNode("AA", 0, 2, 1, annotationType, annotator),
      mockAnnotationNode("CC DD EE", 6, 14, 2, annotationType, annotator),
      mockAnnotationNode("DD", 9, 11, 3, annotationType, annotator),
    ];
    const rootNode = NestedSet.toTree(
      mockAnnotations,
      "AA BB CC DD EE",
      1,
      1,
      new Date(),
      errorCallBack,
    );
    expect(rootNode).not.toBeNull();
    if (rootNode) {
      expect(rootNode.children.length).toEqual(1);

      // first node should be a line annotation
      const lineAnnotationNode = rootNode.children[0];
      expect(lineAnnotationNode.annotationType.name).toEqual(
        NestedSet.LINE_ANNOTATION_TYPE_NAME,
      );

      expect(
        lineAnnotationNode.children[2].children[0].surfaceForms[0],
      ).toEqual("CC ");
      expect(
        lineAnnotationNode.children[2].children[0].startIndices[0],
      ).toEqual(6);
      expect(lineAnnotationNode.children[2].children[0].endIndices[0]).toEqual(
        9,
      );
      expect(lineAnnotationNode.children[2].children[1].id).toEqual(
        mockAnnotations[2].id,
      );
      expect(
        lineAnnotationNode.children[2].children[2].surfaceForms[0],
      ).toEqual(" EE");
      expect(
        lineAnnotationNode.children[2].children[2].startIndices[0],
      ).toEqual(11);
      expect(lineAnnotationNode.children[2].children[2].endIndices[0]).toEqual(
        14,
      );
    }
  });

  it("test creating tree from incorrect overlapping annotations", () => {
    const documentString = "ABCD";
    const mockAnnotations = [
      mockAnnotationNode("AB", 0, 2, 1, annotationType, annotator),
      mockAnnotationNode("BC", 1, 3, 2, annotationType, annotator),
    ];
    const rootNode = NestedSet.toTree(
      mockAnnotations,
      documentString,
      1,
      1,
      new Date(),
      errorCallBack,
    );
    expect(rootNode).toBeNull();
    expect(currentParseError.nodes.length).toEqual(2);
    expect(currentParseError.nodes[0].startIndices[0]).toEqual(0);
    expect(currentParseError.nodes[0].endIndices[0]).toEqual(2);
    expect(currentParseError.nodes[1].startIndices[0]).toEqual(1);
    expect(currentParseError.nodes[1].endIndices[0]).toEqual(3);
  });

  it("test creating tree from annotations without space between", () => {
    const documentString = "AB";
    const mockAnnotations = [
      mockAnnotationNode("A", 0, 1, 1, annotationType, annotator),
      mockAnnotationNode("B", 1, 2, 2, annotationType, annotator),
    ];
    const rootNode = NestedSet.toTree(
      mockAnnotations,
      documentString,
      1,
      1,
      new Date(),
      errorCallBack,
    );
    expect(rootNode).not.toBeNull();
    if (rootNode) {
      expect(rootNode.children.length).toEqual(1);
      // first node should be a line annotation
      const lineAnnotationNode = rootNode.children[0];
      expect(lineAnnotationNode.annotationType.name).toEqual(
        NestedSet.LINE_ANNOTATION_TYPE_NAME,
      );
      expect(lineAnnotationNode.children[0].startIndices[0]).toEqual(0);
      expect(lineAnnotationNode.children[0].endIndices[0]).toEqual(1);
      expect(lineAnnotationNode.children[1].startIndices[0]).toEqual(1);
      expect(lineAnnotationNode.children[1].endIndices[0]).toEqual(2);
    }
  });
});

describe("NestedSet.generateLineNodes(...)", () => {
  it("NestedSet.generateLineNodes()", () => {
    const document = `line1
line2
line3`;
    const lineNodes = NestedSet.generateLineAnnotationNodes(
      document,
      1,
      1,
      new Date(),
    );
    expect(lineNodes.length).toEqual(3);
    expect(lineNodes[0].startIndices[0]).toEqual(0);
    expect(lineNodes[0].endIndices[0]).toEqual(5);
    expect(lineNodes[1].startIndices[0]).toEqual(6);
    expect(lineNodes[1].endIndices[0]).toEqual(11);
    expect(lineNodes[2].startIndices[0]).toEqual(12);
    expect(lineNodes[2].endIndices[0]).toEqual(17);
  });
});

describe("NestedSet.trimWhiteSpaces(...)", () => {
  it("mock with whitespaces in the beginning and end", () => {
    const nodeWithWhiteSpace = new NestedSetNode(
      mockAnnotationNode("  A  ", 0, 5, 1, annotationType, annotator),
    );
    NestedSet.trimWithSpaces(nodeWithWhiteSpace);
    expect(nodeWithWhiteSpace.endIndices[0]).toEqual(3);
    expect(nodeWithWhiteSpace.startIndices[0]).toEqual(2);
  });

  it("mock with whitespaces in the beginning", () => {
    const nodeWithWhiteSpace = new NestedSetNode(
      mockAnnotationNode("  A", 0, 3, 1, annotationType, annotator),
    );
    NestedSet.trimWithSpaces(nodeWithWhiteSpace);
    expect(nodeWithWhiteSpace.startIndices[0]).toEqual(2);
    expect(nodeWithWhiteSpace.endIndices[0]).toEqual(3);
  });

  it("mock with whitespaces in the end", () => {
    const nodeWithWhiteSpace = new NestedSetNode(
      mockAnnotationNode("A   ", 0, 4, 1, annotationType, annotator),
    );
    NestedSet.trimWithSpaces(nodeWithWhiteSpace);
    expect(nodeWithWhiteSpace.startIndices[0]).toEqual(0);
    expect(nodeWithWhiteSpace.endIndices[0]).toEqual(1);
  });
});

describe("test json serialization", () => {
  it("test annotation json serialization", () => {
    const annotationNode = mockAnnotationNode(
      "A   ",
      0,
      4,
      1,
      annotationType,
      annotator,
    );
    expect("id" in annotationNode).toBeTruthy();
    expect("id" in annotationNode.annotationType).toBeTruthy();
    expect("id" in annotationNode.annotator).toBeTruthy();
    // serialize to json
    const annotationJsonString = JSON.stringify(annotationNode);
    // parse back to object
    const parsedAnnotation = JSON.parse(annotationJsonString);
    // the id's should NOT be contained anymore in the objects
    expect(!("id" in parsedAnnotation)).toBeTruthy();
    expect(!("id" in parsedAnnotation.annotation_type)).toBeTruthy();
    expect(!("id" in parsedAnnotation.annotator)).toBeTruthy();
  });
});
