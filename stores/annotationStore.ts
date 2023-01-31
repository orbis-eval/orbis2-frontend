import {defineStore} from "pinia";
import {Annotation} from "~/lib/model/annotation";
import {Run} from "~/lib/model/run";

export const useAnnotationStore = defineStore('annotation', {
    state: () => {
        return {
            annotations: [] as Annotation[],
            undoneAnnotations: [] as Annotation[],
            selectedRun: {} as Run,
        };
    },
    actions: {
        addAnnotation(annotation: Annotation) {
            if (this.undoneAnnotations.length > 0) {
                this.annotations = [];
                this.undoneAnnotations = [];
            }
            this.annotations.push(annotation);
        },
        popAnnotation() {
            return this.annotations.pop();
        },
        undoAnnotation(): Annotation | undefined {
            if (this.annotations.length > 0) {
                const undoneAnnotation = this.annotations.pop();
                if (undoneAnnotation) {
                    this.undoneAnnotations.push(undoneAnnotation);
                    return undoneAnnotation;
                }
            }
        },
        redoAnnotation(): Annotation | undefined {
            if (this.undoneAnnotations.length > 0) {
                const redoneAnnotation = this.undoneAnnotations.pop();
                if (redoneAnnotation) {
                    this.annotations.push(redoneAnnotation);
                    return redoneAnnotation;
                }
            }
        },
        resetAnnotationStack() {
            this.annotations = [];
            this.undoneAnnotations = [];
        },
        changeSelectedRun(run: Run) {
            this.selectedRun = run;
        }
    }
});
