import { Annotation } from "~/lib/model/annotation";
import { AnnotationType } from "~/lib/model/annotationType";
import { Annotator } from "~/lib/model/annotator";
import { NestedSetParseError } from "~/lib/model/nestedset/nestedSetParseError";
import { NestedSetNode } from "~/lib/model/nestedset/nestedSetNode";

export const annotationType: AnnotationType = new AnnotationType({
  name: "A Type",
  colorId: 1,
  id: 1,
});

export const annotator: Annotator = new Annotator({
  name: "test annotator",
  roles: [],
  id: 1,
});

// eslint-disable-next-line import/no-mutable-exports
export let currentParseError: NestedSetParseError;

export const errorCallBack = (parseError: NestedSetParseError) => {
  console.warn("the following nodes could not be parsed:");
  for (const node of parseError.nodes) {
    console.warn(
      `${node.surfaceForms[0]}/(${node.startIndices[0]}:${node.endIndices[0]})`,
    );
  }
  currentParseError = parseError;
};

export function mockAnnotationNode(
  surfaceForm: string,
  start: number,
  end: number,
  id: number,
  annotationType: AnnotationType,
  annotator: Annotator,
): NestedSetNode {
  return new NestedSetNode(
    new Annotation({
      key: "",
      surfaceForms: [surfaceForm],
      startIndices: [start],
      endIndices: [end],
      annotationType: annotationType,
      annotator,
      runId: 1,
      documentId: 1,
      metadata: [],
      timestamp: new Date(),
      id: id,
    }),
  );
}
