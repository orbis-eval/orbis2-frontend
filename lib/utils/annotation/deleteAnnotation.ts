import {Error} from "~/lib/model/error";
import {OrbisApiService} from "~/lib/orbisApi/orbisApiService";
import {NestedSetNode} from "~/lib/model/nestedset/nestedSetNode";
import {NestedSetNodeRemover} from "~/lib/model/nestedset/nestedSetNodeRemover";

export async function deleteAnnotation(annotation: NestedSetNode, orbisApiService: OrbisApiService) {
    const response = await orbisApiService.removeAnnotationFromDocument(annotation.toAnnotation());
    if (response instanceof Error) {
        console.error(response.errorMessage);
    } else {
        // remove the annotation from the tree
        NestedSetNodeRemover.removeAnnotationNode(annotation, parseErrorCallBack);
    }
}

function parseErrorCallBack() {
    //Todo: Correct error handling with Exception
    console.error("Error when deleting an annotation");
}
