import { defineStore } from "pinia";
import { NestedSetNode } from "~/lib/model/nestedset/nestedSetNode";
import { Run } from "~/lib/model/run";
import { ref } from 'vue';

export const useAnnotationStore = defineStore('annotation', () => {
    const annotations = ref([] as NestedSetNode[]);
    const undoneAnnotations = ref([] as NestedSetNode[]);
    const selectedRun = ref({} as Run);

    function reset() {
        annotations.value = [];
        undoneAnnotations.value = [];
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


    return { annotations, undoneAnnotations, selectedRun, addAnnotation, popAnnotation, undoAnnotation, redoAnnotation, resetAnnotationStack: reset };
});
