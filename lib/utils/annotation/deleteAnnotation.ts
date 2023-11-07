import { OrbisApiService } from "~/lib/orbisApi/orbisApiService";
import { NestedSetNode } from "~/lib/model/nestedset/nestedSetNode";
import { NestedSetNodeDeleter } from "~/lib/model/nestedset/nestedSetNodeDeleter";

export async function deleteAnnotation(
  annotation: NestedSetNode,
  orbisApiService: OrbisApiService,
) {
  await orbisApiService.deleteAnnotationFromDocument(annotation.toAnnotation());
  // delete the annotation from the tree
  NestedSetNodeDeleter.deleteAnnotationNode(annotation);
}
