import {defineStore} from "pinia";
import {NestedSetNode} from "~/lib/model/nestedset/nestedSetNode";
import {ref} from 'vue';
import {OrbisApiService} from "~/lib/orbisApi/orbisApiService";
import {NestedSet} from "~/lib/model/nestedset/nestedSet";
import {Error} from "~/lib/model/error";
import {AnnotationType} from "~/lib/model/annotationType";
import {Annotator} from "~/lib/model/annotator";
import {AddAnnotationCommand} from "~/lib/utils/annotation/addAnnotationCommand";
import {AnnotationCommandHistory} from "~/lib/utils/annotation/annotationCommandHistory";
import {DeleteAnnotationCommand} from "~/lib/utils/annotation/deleteAnnotationCommand";
import {Annotation} from "~/lib/model/annotation";

export const useAnnotationStore = defineStore('annotation', () => {
    const nestedSetRootNode = ref({} as NestedSetNode | null);
    const annotationHistory = new AnnotationCommandHistory();

    const isUndoDisabled = ref(true);
    const isRedoDisabled = ref(true);

    function reset() {
        annotationHistory.reset();
        isUndoDisabled.value = true;
        isRedoDisabled.value = true;
    }

    async function loadAnnotations(documentId: number, documentContent: string, runId: number,
                                   annotationTypes: AnnotationType[], orbisApiService: OrbisApiService) {
        try {
            let annotationsFromDb = await orbisApiService.getAnnotations(runId,
                documentId);
            if (Array.isArray(annotationsFromDb)) {
                const mappedAnnotations = mapAnnotations(annotationsFromDb, annotationTypes);

                if (mappedAnnotations) {
                    let annotations = mappedAnnotations.map(annotation => new NestedSetNode(annotation));

                    nestedSetRootNode.value = NestedSet.toTree(
                        annotations,
                        documentContent,
                        runId,
                        1,
                        new Date(),
                        parseErrorCallBack
                    );
                    annotationHistory.reset();
                } else {
                    console.error("Annotations could not be loaded")
                }
            } else {
                console.error(annotationsFromDb.errorMessage);
            }
        } catch (error) {
            return new Error("An error occurred while loading annotations");
        }
    }

    function mapAnnotations(annotationsFromDb: Annotation[], annotationTypes: AnnotationType[]) {
        return annotationsFromDb.map(annotation => {
            const annotationType = annotationTypes.find(annotationType =>
                annotationType.name === annotation.annotation_type.name);
            if (annotationType) {
                annotation.annotation_type.color_id = annotationType.color_id
            } else {
                console.error("Missing annotation type " + annotation.annotation_type.name);
            }
            return annotation;
        });
    }

    function parseErrorCallBack() {
        //TODO: Only placeholder for the moment
        console.error("Creating nestedNodeSet failed");
    }

    async function addAnnotation(surfaceForm: string, start: number, end: number, annotationType: AnnotationType,
                                 annotator: Annotator, runId: number, documentId: number,
                                 orbisApiService: OrbisApiService) {
        if (nestedSetRootNode.value instanceof NestedSetNode) {
            const addCommand = new AddAnnotationCommand(surfaceForm, start, end, annotationType,
                annotator, runId, documentId, nestedSetRootNode.value, orbisApiService);
            await annotationHistory.execute(addCommand);
            isRedoDisabled.value = true;
            isUndoDisabled.value = false;
        } else {
            throw new Error("addAnnotation: Root node ist not set. Call first loadAnnotations.");
        }
    }

    async function deleteAnnotation(annotation: NestedSetNode, orbisApiService: OrbisApiService) {
        if (nestedSetRootNode.value instanceof NestedSetNode) {
            const deleteCommand = new DeleteAnnotationCommand(annotation, nestedSetRootNode.value, orbisApiService);
            await annotationHistory.execute(deleteCommand);
            isRedoDisabled.value = true;
            isUndoDisabled.value = false;
        } else {
            throw new Error("deleteAnnotation: Root node ist not set. Call first loadAnnotations.");
        }
    }

    async function undoAnnotation() {
        isUndoDisabled.value = await annotationHistory.undo();
        isRedoDisabled.value = false;
    }

    async function redoAnnotation() {
        isRedoDisabled.value = await annotationHistory.redo();
        isUndoDisabled.value = false;
    }


    return {
        nestedSetRootNode, isUndoDisabled, isRedoDisabled, loadAnnotations, addAnnotation,
        deleteAnnotation, undoAnnotation, redoAnnotation, resetAnnotationStack: reset
    };
});
