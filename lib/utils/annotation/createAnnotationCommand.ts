import {IAnnotationCommand} from "~/lib/utils/annotation/iAnnotationCommand";
import {AnnotationType} from "~/lib/model/annotationType";
import {Annotator} from "~/lib/model/annotator";
import {NestedSetNode} from "~/lib/model/nestedset/nestedSetNode";
import {OrbisApiService} from "~/lib/orbisApi/orbisApiService";
import {createAnnotation, createNestedSetNode} from "~/lib/utils/annotation/createAnnotation";
import {deleteAnnotation} from "~/lib/utils/annotation/deleteAnnotation";

export class CreateAnnotationCommand implements IAnnotationCommand {

    annotation: NestedSetNode;
    rootNode: NestedSetNode;
    orbisApiService: OrbisApiService;

    constructor(surfaceForm: string, start: number, end: number, annotationType: AnnotationType,
                annotator: Annotator, runId: number, documentId: number, rootNode: NestedSetNode,
                orbisApiService: OrbisApiService) {
        this.annotation = createNestedSetNode(surfaceForm, start, end, 1, runId, documentId, annotationType,
            annotator);
        this.rootNode = rootNode;
        this.orbisApiService = orbisApiService;
    }

    async execute() {
        const newAnnotation = await createAnnotation(this.annotation, this.rootNode, this.orbisApiService);
        if (newAnnotation) {
            this.annotation = newAnnotation;
        }
    }

    async undo() {
        await deleteAnnotation(this.annotation, this.orbisApiService);
    }
}