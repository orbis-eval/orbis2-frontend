import {Annotation} from "~/lib/model/annotation";
import {NestedSetNode} from "~/lib/model/nestedset/nestedSetNode";
import {NestedSet} from "~/lib/model/nestedset/nestedSet";
import {NestedSetParseError} from "~/lib/model/nestedset/nestedSetParseError";
import {AnnotationType} from "~/lib/model/annotationType";
import {Annotator} from "~/lib/model/annotator";
import {OrbisApiService} from "~/lib/orbisApi/orbisApiService";

export async function addAnnotation(annotationToAdd: NestedSetNode, selectedNode: NestedSetNode,
                                    orbisApiService: OrbisApiService) {
    let annotation = annotationToAdd.toAnnotation();

    const annotationResponse = await orbisApiService.addAnnotation(annotation);

    if (annotationResponse instanceof Annotation) {
        let annotationNode = new NestedSetNode(annotationResponse);

        if (annotation.annotation_type.color_id) {
            annotationNode.annotation_type.color_id = annotation.annotation_type.color_id;
        }

        let nodeToInsert = selectedNode;
        // if the selection was made in a GAP_ANNOTATION, we need to add it to the parent of the gap-annotation
        if (nodeToInsert.annotation_type.name === NestedSet.GAP_ANNOTATION_TYPE_NAME && selectedNode.parent) {
            nodeToInsert = selectedNode.parent;
        }

        // add the new node as child
        nodeToInsert.insertAnnotationNode(annotationNode, (parseError: NestedSetParseError) => {
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