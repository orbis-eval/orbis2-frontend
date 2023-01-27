import {defineStore} from "pinia";
import {Annotation} from "~/lib/model/annotation";
import {Run} from "~/lib/model/run";

export const useAnnotationStore = defineStore('annotation', {
    state: () => {
        return {
            annotations: [] as Annotation[],
            undoneAnnotations: [] as Annotation[],
            selectedRun: {} as Run
        };
    },
    actions: {
        addAnnotation(annotation: Annotation) {
            this.undoneAnnotations = [];
            this.annotations.push(annotation);
        },
        popAnnotation() {
            return this.annotations.pop();
        },
        undoAnnotation(callback: Function) {
            if (this.annotations.length > 0) {
                const undoneAnnotation = this.annotations.pop();
                if (undoneAnnotation) {
                    this.undoneAnnotations.push(undoneAnnotation);
                    callback();
                }
            }
        },
        redoAnnotation(callback: Function) {
            if (this.undoneAnnotations.length > 0) {
                const redoAnnotation = this.undoneAnnotations.pop();
                if (redoAnnotation) {
                    this.annotations.push(redoAnnotation);
                    callback();
                }
            }
        }
    }
});
