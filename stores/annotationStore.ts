import { defineStore } from "pinia";
import { ref } from "vue";
import { NestedSetNode } from "~/lib/model/nestedset/nestedSetNode";
import { OrbisApiService } from "~/lib/orbisApi/orbisApiService";
import { NestedSet } from "~/lib/model/nestedset/nestedSet";
import { AnnotationType } from "~/lib/model/annotationType";
import { Annotator } from "~/lib/model/annotator";
import { CreateAnnotationCommand } from "~/lib/utils/annotation/createAnnotationCommand";
import { AnnotationCommandHistory } from "~/lib/utils/annotation/annotationCommandHistory";
import { DeleteAnnotationCommand } from "~/lib/utils/annotation/deleteAnnotationCommand";
import { Annotation } from "~/lib/model/annotation";
import { TextSpan } from "~/lib/model/textSpan";

export const useAnnotationStore = defineStore("annotation", () => {
  const nestedSetRootNode = ref({} as NestedSetNode | null);
  const selectedAnnotation = ref({} as NestedSetNode | null);
  const annotationHistory = new AnnotationCommandHistory();

  const isUndoDisabled = ref(true);
  const isRedoDisabled = ref(true);

  function reset() {
    annotationHistory.reset();
    isUndoDisabled.value = true;
    isRedoDisabled.value = true;
  }

  function mapAnnotations(
    annotationsFromDb: Annotation[],
    annotationTypes: AnnotationType[],
  ) {
    return annotationsFromDb.map((annotation) => {
      const annotationType = annotationTypes.find(
        (annotationType) =>
          annotationType.name === annotation.annotationType.name,
      );
      if (annotationType) {
        annotation.annotationType.colorId = annotationType.colorId;
      } else {
        console.error(
          "Missing annotation type " + annotation.annotationType.name,
        );
      }
      return annotation;
    });
  }

  function setSelectedAnnotation(annotation: NestedSetNode) {
    selectedAnnotation.value = annotation;
  }

  async function loadAnnotations(
    documentId: number,
    documentContent: string,
    runId: number,
    annotationTypes: AnnotationType[],
    orbisApiService: OrbisApiService,
  ) {
    try {
      const annotationsFromDb = await orbisApiService.getAnnotations(
        runId,
        documentId,
      );
      const mappedAnnotations = mapAnnotations(
        annotationsFromDb,
        annotationTypes,
      );

      if (mappedAnnotations) {
        let annotations = mappedAnnotations.map(
          (annotation) => new NestedSetNode(annotation),
        );

        nestedSetRootNode.value = NestedSet.toTree(
          annotations,
          documentContent,
          runId,
          1,
          new Date(),
        );
        annotationHistory.reset();

        annotations = nestedSetRootNode.value.allAnnotationNodes();
        if (annotations.length > 0) {
          selectedAnnotation.value = annotations[0];
        } else {
          selectedAnnotation.value = null;
        }
      } else {
        console.error("Annotations could not be loaded");
      }
    } catch (error) {
      throw new Error("An error occurred while loading annotations", {
        cause: error,
      });
    }
  }

  async function createAnnotation(
    textSpan: TextSpan,
    annotationType: AnnotationType,
    annotator: Annotator,
    runId: number,
    documentId: number,
    orbisApiService: OrbisApiService,
  ) {
    if (nestedSetRootNode.value instanceof NestedSetNode) {
      const addCommand = new CreateAnnotationCommand(
        textSpan,
        annotationType,
        annotator,
        runId,
        documentId,
        nestedSetRootNode.value,
        orbisApiService,
      );
      await annotationHistory.execute(addCommand);
      isRedoDisabled.value = true;
      isUndoDisabled.value = false;
    } else {
      throw new TypeError(
        "createAnnotation: Root node ist not set. Call first loadAnnotations.",
      );
    }
  }

  async function deleteAnnotation(
    annotation: NestedSetNode,
    orbisApiService: OrbisApiService,
  ) {
    if (nestedSetRootNode.value instanceof NestedSetNode) {
      const deleteCommand = new DeleteAnnotationCommand(
        annotation,
        nestedSetRootNode.value,
        orbisApiService,
      );
      await annotationHistory.execute(deleteCommand);
      isRedoDisabled.value = true;
      isUndoDisabled.value = false;
      selectedAnnotation.value = null;
    } else {
      throw new TypeError(
        "deleteAnnotation: Root node ist not set. Call first loadAnnotations.",
      );
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
    nestedSetRootNode,
    isUndoDisabled,
    isRedoDisabled,
    selectedAnnotation,
    setSelectedAnnotation,
    loadAnnotations,
    createAnnotation,
    deleteAnnotation,
    undoAnnotation,
    redoAnnotation,
    resetAnnotationStack: reset,
  };
});
