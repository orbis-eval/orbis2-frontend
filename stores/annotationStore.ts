import {defineStore} from "pinia";
import {NestedSetNode} from "~/lib/model/nestedset/nestedSetNode";
import {useRunStore} from "~/stores/runStore";
import {useDocumentStore} from "~/stores/documentStore";
import {ref} from 'vue';
import {OrbisApiService} from "~/lib/orbisApi/orbisApiService";
import {NestedSet} from "~/lib/model/nestedset/nestedSet";
import {Error} from "~/lib/model/error";

export const useAnnotationStore = defineStore('annotation', () => {
    const run = useRunStore();
    const documents = useDocumentStore();
    const annotations = ref([] as NestedSetNode[]);
    const undoneAnnotations = ref([] as NestedSetNode[]);
    const nestedSetRootNode = ref({} as NestedSetNode);

    function reset() {
        annotations.value = [];
        undoneAnnotations.value = [];
    }

    async function loadAnnotations(orbisApiService: OrbisApiService) {
        try {
            let annotationsFromDb = await orbisApiService.getAnnotations(run.selectedRun._id,
                documents.currentDocument._id);
            if (Array.isArray(annotationsFromDb)) {
                annotationsFromDb = annotationsFromDb.map(annotation => {
                    annotation.annotation_type.color_id =
                        run.selectedRun.corpus.supported_annotation_types.find(annotationType => annotationType.name === annotation.annotation_type.name)
                            .color_id;
                    return annotation;
                });
                annotations.value = annotationsFromDb;

                nestedSetRootNode.value = NestedSet.toTree(
                    annotationsFromDb,
                    documents.currentDocument.content,
                    run.selectedRun,
                    1,
                    new Date(),
                    parseErrorCallBack
                );
            } else {
                console.error(annotationsFromDb.errorMessage);
            }
        } catch (error) {
            return new Error("An error occurred while loading annotations");
        }
    }

    function parseErrorCallBack() {
        //TODO: Only placeholder for the moment
    }

    function addAnnotation(annotation: NestedSetNode) {
        if (undoneAnnotations.value.length > 0) {
            annotations.value = [];
            undoneAnnotations.value = [];
        }
        annotations.value.push(annotation);
    }

    function popAnnotation(): NestedSetNode | undefined {
        return annotations.value.pop();
    }

    function undoAnnotation(): NestedSetNode | undefined {
        if (annotations.value.length > 0) {
            const undoneAnnotation = annotations.value.pop();
            if (undoneAnnotation) {
                undoneAnnotations.value.push(undoneAnnotation);
                return undoneAnnotation;
            }
        }
    }

    function redoAnnotation(): NestedSetNode | undefined {
        if (undoneAnnotations.value.length > 0) {
            const redoneAnnotation = undoneAnnotations.value.pop();
            if (redoneAnnotation) {
                annotations.value.push(redoneAnnotation);
                return redoneAnnotation;
            }
        }
    }


    return {
        annotations, undoneAnnotations, nestedSetRootNode, loadAnnotations, addAnnotation, popAnnotation, undoAnnotation,
        redoAnnotation, resetAnnotationStack: reset
    };
});
