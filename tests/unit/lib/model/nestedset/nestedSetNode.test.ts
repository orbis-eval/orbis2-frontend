import { describe, expect, it } from "vitest";
import { NestedSet } from "~/lib/model/nestedset/nestedSet";
import {
  annotationType,
  annotator,
  errorCallBack,
  mockAnnotationNode,
} from "~/tests/unit/lib/model/nestedset/nestedSetUtils";

describe("NestedSetNode.getAnnotations(...)", () => {
  it("get all annotations from a node", () => {
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
      const annotations = rootNode.allAnnotationNodes();
      expect(annotations.length).toEqual(3);
      expect(annotations[0].startIndices[0]).toEqual(0);
      expect(annotations[0].endIndices[0]).toEqual(2);
      expect(annotations[1].startIndices[0]).toEqual(6);
      expect(annotations[1].endIndices[0]).toEqual(14);
      expect(annotations[2].startIndices[0]).toEqual(9);
      expect(annotations[2].endIndices[0]).toEqual(11);
    }
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
