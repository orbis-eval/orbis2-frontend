import {defineStore} from "pinia";
import {NestedSetNode} from "~/lib/model/nestedset/nestedSetNode";
import {useRunStore} from "~/stores/runStore";
import {useDocumentStore} from "~/stores/documentStore";
import {ref} from 'vue';
import {OrbisApiService} from "~/lib/orbisApi/orbisApiService";
import {NestedSet} from "~/lib/model/nestedset/nestedSet";
import {Error} from "~/lib/model/error";
import {AnnotationType} from "~/lib/model/annotationType";
import {Annotator} from "~/lib/model/annotator";
import {AddAnnotationCommand} from "~/lib/utils/annotation/addAnnotationCommand";
import {CommandHistory} from "~/lib/utils/annotation/AnnotationCommandHistory";
import {DeleteAnnotationCommand} from "~/lib/utils/annotation/deleteAnnotationCommand";

export const useAnnotationStore = defineStore('annotation', () => {
    const run = useRunStore();
    const documents = useDocumentStore();
    const annotations = ref([] as NestedSetNode[]);
    const nestedSetRootNode = ref({} as NestedSetNode);
    const annotationHistory = new CommandHistory();

    function reset() {
        annotations.value = [];
        annotationHistory.reset();
    }

    async function loadAnnotations(orbisApiService: OrbisApiService) {
        try {
            let annotationsFromDb = await orbisApiService.getAnnotations(run.selectedRun._id,
                documents.currentDocument._id);
            if (Array.isArray(annotationsFromDb)) {
                annotations.value = annotationsFromDb.map(annotation => {
                    annotation.annotation_type.color_id =
                        run.selectedRun.corpus.supported_annotation_types.find(annotationType => annotationType.name === annotation.annotation_type.name)
                            .color_id;
                    return annotation;
                });

                nestedSetRootNode.value = NestedSet.toTree(
                    annotations.value,
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

    async function addAnnotation(surfaceForm: string, start: number, end: number, annotationType: AnnotationType,
                                 annotator: Annotator, runId: number, documentId: number, selectedNode: NestedSetNode,
                                 orbisApiService: OrbisApiService) {
        const addCommand = new AddAnnotationCommand(surfaceForm, start, end, annotationType,
            annotator, runId, documentId, selectedNode, orbisApiService);
        await annotationHistory.execute(addCommand);
    }

    async function deleteAnnotation(annotation: NestedSetNode, orbisApiService: OrbisApiService) {
        const deleteCommand = new DeleteAnnotationCommand(annotation, orbisApiService);
        await annotationHistory.execute(deleteCommand);
    }

    async function undoAnnotation() {
        await annotationHistory.undo();
    }

    async function redoAnnotation() {
        await annotationHistory.redo();
    }


    return {
        annotations, nestedSetRootNode, loadAnnotations, addAnnotation, deleteAnnotation, undoAnnotation,
        redoAnnotation, resetAnnotationStack: reset
    };
});
