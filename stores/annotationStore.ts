import {defineStore} from "pinia";
import {Annotation} from "~/lib/model/annotation";

export const useAnnotationStore = defineStore('annotation', {
    state: () => {
        return {
            annotations: [] as Annotation[],
            undoneAnnotations: [] as Annotation[]
        }
    },
    actions: {
        addAnnotation(annotation: Annotation) {
            this.annotations.push(annotation)
        },
        popAnnotation() {
            return this.annotations.pop();
        },
        undoAnnotation(callback: Function) {
            if (this.annotations.length > 0) {
                const undoneAnnotation = this.popAnnotation();
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
                    this.addAnnotation(redoAnnotation);
                    callback();
                }
            }
        }
    }
})
