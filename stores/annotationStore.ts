import {defineStore} from "pinia";
import {Annotation} from "~/lib/model/annotation";
import {pop} from "@jridgewell/set-array";

export const useAnnotationStore = defineStore('annotation', {
    state: () => {
        // let result = [] as Annotation[];
        // if (localStorage != undefined) {
        //     const localStorageState = localStorage.getItem('annotationStore');
        //     if (localStorageState) {
        //         Object.assign(result, JSON.parse(localStorageState));
        //     }
        // }
        return {
            annotations: [] as Annotation[],
            undoneAnnotations: [] as Annotation[]
        }
    },
    actions: {
        addAnnotation(annotation: Annotation) {
            this.annotations.push(annotation)
            localStorage.setItem('annotationStore', JSON.stringify(this.$state));
        },
        popAnnotation() {
            const poppedAnnotation = this.annotations.pop();
            localStorage.setItem('annotationStore', JSON.stringify(this.$state));
            return poppedAnnotation;
        },
        loadAnnotationFromLocalStorage() {
            const state = localStorage.getItem('annotationStore');
            if (state) {
                Object.assign(this.$state, JSON.parse(state));
            }
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
