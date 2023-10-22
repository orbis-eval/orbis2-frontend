import {Annotation} from "~/lib/model/annotation";
import {NestedSetNode} from "~/lib/model/nestedset/nestedSetNode";
import {NestedSet} from "~/lib/model/nestedset/nestedSet";
import {NestedSetParseError} from "~/lib/model/nestedset/nestedSetParseError";
import {AnnotationType} from "~/lib/model/annotationType";
import {Annotator} from "~/lib/model/annotator";
import {OrbisApiService} from "~/lib/orbisApi/orbisApiService";
import {NestedSetNodeInserter} from "~/lib/model/nestedset/nestedSetNodeInserter";

export async function createAnnotation(annotationToCreate: NestedSetNode, rootNode: NestedSetNode,
                                    orbisApiService: OrbisApiService) {
    let annotation = annotationToCreate.toAnnotation();

    const annotationResponse = await orbisApiService.createAnnotation(annotation);

    if (annotationResponse instanceof Annotation) {
        let annotationNode = new NestedSetNode(annotationResponse);

        if (annotation.annotation_type.color_id) {
            annotationNode.annotation_type.color_id = annotation.annotation_type.color_id;
        }

        // add the new node as child
        NestedSetNodeInserter.insertAnnotationNode(rootNode, annotationNode, (parseError: NestedSetParseError) => {
            // TODO: do proper error handling
            console.warn(`could not update the tree, error: ${JSON.stringify(parseError)}`);
        });
        return annotationNode;
    } else {
        // TODO, 06.01.2023 anf: correct error handling
        console.error(annotationResponse.errorMessage);
    }
}

export function createNestedSetNode(
    surfaceForm: string,
    start: number,
    end: number,
    id: number,
    runId: number,
    documentId: number,
    annotationType: AnnotationType,
    annotator: Annotator): NestedSetNode {
    return new NestedSetNode(NestedSet.trimWithSpaces(new Annotation({
        key: "",
        surface_forms: [surfaceForm],
        start_indices: [start],
        end_indices: [end],
        annotation_type: annotationType,
        annotator: annotator,
        run_id: runId,
        document_id: documentId,
        metadata: [],
        timestamp: new Date(),
        _id: id
    })));
}