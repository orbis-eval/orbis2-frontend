import { defineStore } from "pinia";
import { ref } from "vue";
import { NestedSetNode } from "~/lib/model/nestedset/nestedSetNode";
import { OrbisApiService } from "~/lib/services/orbisApiService";
import { NestedSet } from "~/lib/model/nestedset/nestedSet";
import { AnnotationType } from "~/lib/model/annotationType";
import { Annotator } from "~/lib/model/annotator";
import { CreateAnnotationCommand } from "~/lib/utils/annotation/createAnnotationCommand";
import { AnnotationCommandHistory } from "~/lib/utils/annotation/annotationCommandHistory";
import { DeleteAnnotationCommand } from "~/lib/utils/annotation/deleteAnnotationCommand";
import { Annotation } from "~/lib/model/annotation";
import { TextSpan } from "~/lib/model/textSpan";

export const useAnnotationStore = defineStore("annotation", () => {
  const rc = useRuntimeConfig();
  const orbisApiService = new OrbisApiService(rc.public.orbisBaseUrl);
  const nestedSetRootNode = ref({} as NestedSetNode | null);
  const selectedAnnotation = ref({} as NestedSetNode | null);
  const annotationHistory = new AnnotationCommandHistory();

  const mappedAnnotations = ref([] as Annotation[]);
  const filteredAnnotations = ref([] as Annotation[]);
  const documentContent = ref("");

  const isUndoDisabled = ref(true);
  const isRedoDisabled = ref(true);
  const isGoldStandardAnnotationsShown = ref(false);

  function reset() {
    annotationHistory.reset();
    isUndoDisabled.value = true;
    isRedoDisabled.value = true;
    isGoldStandardAnnotationsShown.value = false;
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

  function moveSelectedAnnotation(condition: Function) {
    if (selectedAnnotation.value && nestedSetRootNode.value) {
      const annotations = nestedSetRootNode.value.allAnnotationNodes();
      const indexAnnotation = annotations.indexOf(selectedAnnotation.value);
      condition(indexAnnotation, annotations);
    }
  }

  function nextSelectedAnnotation() {
    moveSelectedAnnotation(
      (indexAnnotation: number, annotations: NestedSetNode[]) => {
        if (annotations.length - 1 > indexAnnotation) {
          selectedAnnotation.value = annotations[indexAnnotation + 1];
        }
      },
    );
  }

  function prevSelectedAnnotation() {
    moveSelectedAnnotation(
      (indexAnnotation: number, annotations: NestedSetNode[]) => {
        if (indexAnnotation > 0) {
          selectedAnnotation.value = annotations[indexAnnotation - 1];
        }
      },
    );
  }

  function initSelectedAnnotation() {
    if (nestedSetRootNode.value) {
      const annotations = nestedSetRootNode.value.allAnnotationNodes();
      if (annotations.length > 0) {
        selectedAnnotation.value = annotations[0];
      } else {
        selectedAnnotation.value = null;
      }
    }
  }

  function buildNodeTree() {
    const annotations = filteredAnnotations.value.map(
      (annotation) => new NestedSetNode(annotation),
    );

    let runId = -1;
    if (mappedAnnotations.value.length > 0) {
      runId = mappedAnnotations.value[0].runId;
    }

    nestedSetRootNode.value = NestedSet.toTree(
      annotations,
      documentContent.value,
      runId,
      1,
      new Date(),
    );
    annotationHistory.reset();
    initSelectedAnnotation();
  }

  async function loadAnnotations(
    documentId: number,
    _documentContent: string,
    runId: number,
    annotationTypes: AnnotationType[],
  ) {
    try {
      const annotationsFromDb = await orbisApiService.getAnnotations(
        runId,
        documentId,
      );
      mappedAnnotations.value = mapAnnotations(
        annotationsFromDb,
        annotationTypes,
      );
      filteredAnnotations.value = mappedAnnotations.value;
      documentContent.value = _documentContent;

      buildNodeTree();
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

  async function deleteAnnotation(annotation: NestedSetNode) {
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
    reset,
    nestedSetRootNode,
    isUndoDisabled,
    isRedoDisabled,
    selectedAnnotation,
    setSelectedAnnotation,
    nextSelectedAnnotation,
    prevSelectedAnnotation,
    loadAnnotations,
    createAnnotation,
    deleteAnnotation,
    undoAnnotation,
    redoAnnotation,
    resetAnnotationStack: reset,
    isGoldStandardAnnotationsShown,
    buildNodeTree,
    filteredAnnotations,
    mappedAnnotations,
  };
});
