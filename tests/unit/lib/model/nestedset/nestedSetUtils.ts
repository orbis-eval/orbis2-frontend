import { Annotation } from "~/lib/model/annotation";
import { AnnotationType } from "~/lib/model/annotationType";
import { Annotator } from "~/lib/model/annotator";
import { NestedSetParseError } from "~/lib/model/nestedset/nestedSetParseError";
import { NestedSetNode } from "~/lib/model/nestedset/nestedSetNode";

export const annotationType: AnnotationType = new AnnotationType({
  name: "A Type",
  color_id: 1,
  _id: 1,
});

export const annotator: Annotator = new Annotator({
  name: "test annotator",
  roles: [],
  _id: 1,
});

// eslint-disable-next-line import/no-mutable-exports
export let currentParseError: NestedSetParseError;

export const errorCallBack = (parseError: NestedSetParseError) => {
  console.warn("the following nodes could not be parsed:");
  for (const node of parseError.nodes) {
    console.warn(
      `${node.surface_forms[0]}/(${node.start_indices[0]}:${node.end_indices[0]})`,
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
      surface_forms: [surfaceForm],
      start_indices: [start],
      end_indices: [end],
      annotation_type: annotationType,
      annotator,
      run_id: 1,
      document_id: 1,
      metadata: [],
      timestamp: new Date(),
      _id: id,
    }),
  );
}
