import {IAnnotationCommand} from "~/lib/utils/annotation/iAnnotationCommand";
import {AnnotationType} from "~/lib/model/annotationType";
import {Annotator} from "~/lib/model/annotator";
import {NestedSetNode} from "~/lib/model/nestedset/nestedSetNode";
import {OrbisApiService} from "~/lib/orbisApi/orbisApiService";
import {addAnnotation, createNestedSetNode} from "~/lib/utils/annotation/addAnnotation";
import {deleteAnnotation} from "~/lib/utils/annotation/deleteAnnotation";

export class AddAnnotationCommand implements IAnnotationCommand {

    annotation?: NestedSetNode;
    selectedNode: NestedSetNode;
    orbisApiService: OrbisApiService;

    constructor(surfaceForm: string, start: number, end: number, annotationType: AnnotationType,
                annotator: Annotator, runId: number, documentId: number, selectedNode: NestedSetNode,
                orbisApiService: OrbisApiService) {
        this.annotation = createNestedSetNode(surfaceForm, start, end, 1, runId, documentId, annotationType,
            annotator);
        this.selectedNode = selectedNode;
        this.orbisApiService = orbisApiService;
    }

    async execute() {
        if (this.annotation) {
            const newAnnotation = await addAnnotation(this.annotation, this.selectedNode,
                this.orbisApiService);
            if (newAnnotation) {
                this.annotation = newAnnotation;
            }
        } else {
            console.warn("No annotation in add annotation command");
        }
    }

    async undo() {
        if (this.annotation) {
            await deleteAnnotation(this.annotation, this.orbisApiService);
        } else {
            console.warn("No annotation in undo add annotation command");
        }
    }
}