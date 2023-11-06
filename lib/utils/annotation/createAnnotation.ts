import { Annotation } from "~/lib/model/annotation";
import { NestedSetNode } from "~/lib/model/nestedset/nestedSetNode";
import { NestedSet } from "~/lib/model/nestedset/nestedSet";
import { NestedSetParseError } from "~/lib/model/nestedset/nestedSetParseError";
import { AnnotationType } from "~/lib/model/annotationType";
import { Annotator } from "~/lib/model/annotator";
import { OrbisApiService } from "~/lib/orbisApi/orbisApiService";
import { NestedSetNodeInserter } from "~/lib/model/nestedset/nestedSetNodeInserter";
import { TextSpan } from "~/lib/model/textSpan";

export async function createAnnotation(
  annotationToCreate: NestedSetNode,
  rootNode: NestedSetNode,
  orbisApiService: OrbisApiService,
) {
  const annotation = annotationToCreate.toAnnotation();

  const annotationResponse = await orbisApiService.createAnnotation(annotation);

  if (annotationResponse instanceof Annotation) {
    const annotationNode = new NestedSetNode(annotationResponse);

    if (annotation.annotationType.colorId) {
      annotationNode.annotationType.colorId = annotation.annotationType.colorId;
    }

    // add the new node as child
    NestedSetNodeInserter.insertAnnotationNode(
      rootNode,
      annotationNode,
      (parseError: NestedSetParseError) => {
        // TODO: do proper error handling
        console.warn(
          `could not update the tree, error: ${JSON.stringify(parseError)}`,
        );
      },
    );
    return annotationNode;
  } else {
    // TODO, 06.01.2023 anf: correct error handling
    console.error(annotationResponse.errorMessage);
  }
}

export function createNestedSetNode(
  textSpan: TextSpan,
  id: number,
  runId: number,
  documentId: number,
  annotationType: AnnotationType,
  annotator: Annotator,
): NestedSetNode {
  return new NestedSetNode(
    NestedSet.trimWithSpaces(
      new Annotation({
        key: "",
        surfaceForms: [textSpan.surfaceForm],
        startIndices: [textSpan.start],
        endIndices: [textSpan.end],
        annotationType: annotationType,
        annotator,
        runId: runId,
        documentId: documentId,
        metadata: [],
        timestamp: new Date(),
        id: id,
      }),
    ),
  );
}
