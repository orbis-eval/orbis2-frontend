import {defineStore} from "pinia";
import {Run} from "~/lib/model/run";
import {NestedSetNode} from "~/lib/model/nestedset/nestedSetNode";

export const useAnnotationStore = defineStore('annotation', {
    state: () => {
        return {
            annotations: [] as NestedSetNode[],
            undoneAnnotations: [] as NestedSetNode[],
            selectedRun: {} as Run,
            currentSelectedDocPage: 1
        };
    },
    actions: {
        addAnnotation(annotation: NestedSetNode) {
            if (this.undoneAnnotations.length > 0) {
                this.annotations = [];
                this.undoneAnnotations = [];
            }
            this.annotations.push(annotation);
        },
        popAnnotation() {
            return this.annotations.pop();
        },
        undoAnnotation(): NestedSetNode | undefined {
            if (this.annotations.length > 0) {
                const undoneAnnotation = this.annotations.pop();
                if (undoneAnnotation) {
                    this.undoneAnnotations.push(undoneAnnotation);
                    return undoneAnnotation;
                }
            }
        },
        redoAnnotation(): NestedSetNode | undefined {
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
