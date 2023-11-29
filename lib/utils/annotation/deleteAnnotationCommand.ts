import { IAnnotationCommand } from "~/lib/utils/annotation/iAnnotationCommand";
import { NestedSetNode } from "~/lib/model/nestedset/nestedSetNode";
import { OrbisApiService } from "~/lib/services/orbisApiService";
import { createAnnotation } from "~/lib/utils/annotation/createAnnotation";
import { deleteAnnotation } from "~/lib/utils/annotation/deleteAnnotation";

export class DeleteAnnotationCommand implements IAnnotationCommand {
  annotation: NestedSetNode;
  rootNode: NestedSetNode;
  orbisApiService: OrbisApiService;

  constructor(
    annotation: NestedSetNode,
    rootNode: NestedSetNode,
    orbisApiService: OrbisApiService,
  ) {
    this.annotation = annotation;
    this.rootNode = rootNode;
    this.orbisApiService = orbisApiService;
  }

  async execute() {
    await deleteAnnotation(this.annotation, this.orbisApiService);
  }

  async undo() {
    const newAnnotation = await createAnnotation(
      this.annotation,
      this.rootNode,
      this.orbisApiService,
    );
    if (newAnnotation) {
      this.annotation = newAnnotation;
    }
  }
}
