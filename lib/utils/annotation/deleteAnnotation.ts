import { Error } from "~/lib/model/error";
import { OrbisApiService } from "~/lib/orbisApi/orbisApiService";
import { NestedSetNode } from "~/lib/model/nestedset/nestedSetNode";
import { NestedSetNodeDeleter } from "~/lib/model/nestedset/nestedSetNodeDeleter";

export async function deleteAnnotation(
  annotation: NestedSetNode,
  orbisApiService: OrbisApiService,
) {
  const response = await orbisApiService.deleteAnnotationFromDocument(
    annotation.toAnnotation(),
  );
  if (response instanceof Error) {
    console.error(response.errorMessage);
  } else {
    // delete the annotation from the tree
    NestedSetNodeDeleter.deleteAnnotationNode(annotation, parseErrorCallBack);
  }
}

function parseErrorCallBack() {
  // Todo: Correct error handling with Exception
  console.error("Error when deleting an annotation");
}
