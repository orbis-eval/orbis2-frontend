import {IAnnotationCommand} from "~/lib/utils/annotation/iAnnotationCommand";
import {NestedSetNode} from "~/lib/model/nestedset/nestedSetNode";
import {OrbisApiService} from "~/lib/orbisApi/orbisApiService";
import {addAnnotation} from "~/lib/utils/annotation/addAnnotation";
import {deleteAnnotation} from "~/lib/utils/annotation/deleteAnnotation";

export class DeleteAnnotationCommand implements IAnnotationCommand {
    annotation?: NestedSetNode;
    selectedNode: NestedSetNode;
    orbisApiService: OrbisApiService;

    constructor(annotation: NestedSetNode,
                orbisApiService: OrbisApiService) {
        this.annotation = annotation;
        this.selectedNode = annotation;
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
            await addAnnotation(this.annotation, this.selectedNode,
                this.orbisApiService);
        } else {
            console.warn("No annotation in undo remove annotation command");
        }

    }
}