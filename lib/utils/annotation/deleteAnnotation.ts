import { OrbisApiService } from "~/lib/orbisApi/orbisApiService";
import { NestedSetNode } from "~/lib/model/nestedset/nestedSetNode";
import { NestedSetNodeDeleter } from "~/lib/model/nestedset/nestedSetNodeDeleter";

function parseErrorCallBack() {
  // Todo: Correct error handling with Exception
  console.error("Error when deleting an annotation");
}

export async function deleteAnnotation(
  annotation: NestedSetNode,
  orbisApiService: OrbisApiService,
) {
  await orbisApiService.deleteAnnotationFromDocument(annotation.toAnnotation());
  // delete the annotation from the tree
  NestedSetNodeDeleter.deleteAnnotationNode(annotation, parseErrorCallBack);
}
