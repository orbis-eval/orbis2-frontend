import { Annotation } from "~/lib/model/annotation";
import { AnnotationType } from "~/lib/model/annotationType";
import { Annotator } from "~/lib/model/annotator";
import { NestedSetNode } from "~/lib/model/nestedset/nestedSetNode";

/* eslint-disable @typescript-eslint/naming-convention */
export const annotationType: AnnotationType = new AnnotationType({
  name: "A Type",
  colorId: 1,
  identifier: 1,
});

export const annotator: Annotator = new Annotator({
  name: "test annotator",
  roles: [],
  identifier: 1,
});

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
      annotationType,
      annotator,
      runId: 1,
      documentId: 1,
      metadata: [],
      timestamp: new Date(),
      identifier: id,
    }),
  );
}
