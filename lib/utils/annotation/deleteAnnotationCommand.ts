import {IAnnotationCommand} from "~/lib/utils/annotation/iAnnotationCommand";
import {NestedSetNode} from "~/lib/model/nestedset/nestedSetNode";
import {OrbisApiService} from "~/lib/orbisApi/orbisApiService";
import {addAnnotation} from "~/lib/utils/annotation/addAnnotation";
import {deleteAnnotation} from "~/lib/utils/annotation/deleteAnnotation";

export class DeleteAnnotationCommand implements IAnnotationCommand {
    annotation: NestedSetNode;
    parentNode: NestedSetNode | null;
    orbisApiService: OrbisApiService;

    constructor(annotation: NestedSetNode,
                orbisApiService: OrbisApiService) {
        this.annotation = annotation;
        this.parentNode = annotation.parent;
        this.orbisApiService = orbisApiService;
    }

    async execute() {
        if (this.annotation) {
            await deleteAnnotation(this.annotation, this.orbisApiService);
        } else {
            console.warn("No annotation in remove annotation command");
        }
    }

    async undo() {
        if (this.annotation) {
            if (this.parentNode) {
                await addAnnotation(this.annotation, this.parentNode,
                    this.orbisApiService);
            } else {
                await addAnnotation(this.annotation, this.annotation,
                    this.orbisApiService);
            }
        } else {
            console.warn("No annotation in undo remove annotation command");
        }

    }
}