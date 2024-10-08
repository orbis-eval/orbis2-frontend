<template>
  <div>
    <div v-if="nestedSetRootNode && props.run && props.run.corpus">
      <div ref="relativeDiv" class="px-4">
        <!-- context modal gui for selecting the type -->
        <AnnotationModal
          ref="annotationTypeModal"
          :annotation-types="props.run.corpus.supportedAnnotationTypes"
          :is-visible="showAnnotationModal"
          :left-position="mousePosX"
          :selection-surface-form="selectionSurfaceForm"
          :top-position="mousePosY"
          @commitAnnotationType="createAnnotation"
          @hideAnnotationModal="hideAnnotationModal"
        />

        <AnnotationNode
          :color-palette="currentColorPalette"
          :highlighted-nested-set-node-id="highlightedNestedSetNodeId"
          :nested-set-node="nestedSetRootNode"
          @deleteAnnotation="deleteAnnotation"
          @updateAnnotations="updateAnnotations"
        />
      </div>
    </div>
    <div v-else-if="errorNodes.length > 0">
      <h2 class="text-4xl">Tree could not be rendered</h2>
      Annotations that possibly are overlapping:
      <ul>
        <li v-for="node in errorNodes" :key="node.identifier">
          {{ node.surfaceForms[0] }}:({{ node.startIndices[0] }}/{{
            node.endIndices[0]
          }})
        </li>
      </ul>
    </div>
    <div
      v-if="wrongRunSelectedEnabled"
      class="fixed inset-0 z-50 flex items-center justify-center"
    >
      <OrbisWarning
        confirm-text="ok"
        message="Default run cannot be annotated."
        title="Default Run Selected"
        :on-confirm="() => (wrongRunSelectedEnabled = false)"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { AnnotationType } from "~/lib/model/annotationType";
import { Annotator } from "~/lib/model/annotator";
import { useAnnotationStore } from "~/stores/annotationStore";
import { NestedSetNode } from "~/lib/model/nestedset/nestedSetNode";
import { useColorPalettesStore } from "~/stores/colorPalettesStore";
import { Annotation } from "~/lib/model/annotation";
import AnnotationModal from "~/components/annotation/annotationModal.vue";
import { TextSpan } from "~/lib/model/textSpan";
import { Run } from "~/lib/model/run";

const props = defineProps<{
  highlightedNestedSetNodeId: number[];
  run: InstanceType<typeof Run>;
}>();

const route = useRoute();

const selection = ref(null as any);
const selectionSurfaceForm = ref("");
const relativeDiv = ref({} as HTMLDivElement);
const mousePosX = ref(0);
const mousePosY = ref(0);
const showAnnotationModal = ref(false);
const errorNodes = ref([] as Annotation[]);
const annotationStore = useAnnotationStore();
const { nestedSetRootNode } = storeToRefs(annotationStore);
const colorPalettesStore = useColorPalettesStore();
const { currentColorPalette } = storeToRefs(colorPalettesStore);

const annotationTypeModal = ref({} as InstanceType<typeof AnnotationModal>);
const wrongRunSelectedEnabled = ref(false);

async function undoAnnotation() {
  await annotationStore.undoAnnotation();
}

async function redoAnnotation() {
  await annotationStore.redoAnnotation();
}

const clickOutsideListener = (event: MouseEvent) => {
  if (showAnnotationModal.value) {
    if (
      event.target === annotationTypeModal.value.$el ||
      event.composedPath().includes(annotationTypeModal.value.$el)
    ) {
      return;
    }
    if (event.target !== selection.value?.selectionElement) {
      // only hide if the click does NOT come from the element where the text was selected
      showAnnotationModal.value = false;
    }
  }
};

const undoEventListener = (event: KeyboardEvent) => {
  if (event.ctrlKey && event.shiftKey && event.key === "Z") {
    redoAnnotation();
  } else if (event.ctrlKey && event.key === "z") {
    undoAnnotation();
  }
};

onBeforeMount(() => {
  window.addEventListener("keydown", undoEventListener);
});

onMounted(() => {
  window.addEventListener("click", clickOutsideListener);
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", undoEventListener);
  window.removeEventListener("click", clickOutsideListener);
});

// TODO: use the annotator loaded from the backend
const annotator: Annotator = new Annotator({
  name: "test annotator",
  roles: [],
});

async function deleteAnnotation(nestedSetNode: NestedSetNode) {
  await annotationStore.deleteAnnotation(nestedSetNode);
}

function hideAnnotationModal() {
  showAnnotationModal.value = false;
}

function updateAnnotations(currentSelection: any) {
  if (props.run.name.includes("default")) {
    console.log("default run selected for annotation");
    wrongRunSelectedEnabled.value = true;
  } else if (currentSelection) {
    selection.value = currentSelection;
    selectionSurfaceForm.value = currentSelection.word;
    showAnnotationModal.value = true;
    const relativeDivRect = relativeDiv.value.getBoundingClientRect();
    const x = currentSelection.left - relativeDivRect.left; // x/left position within the element.
    const y = currentSelection.top - relativeDivRect.top + 25; // y/top position within the element, add 40px to position it under the selection
    mousePosX.value = x;
    mousePosY.value = y;
  } else {
    console.error("no current selection");
  }
}

// called when creating a new annotation
async function createAnnotation(annotationType: AnnotationType) {
  try {
    if (props.run.identifier) {
      const textSpan = new TextSpan(
        selection.value.word,
        selection.value.start,
        selection.value.end,
      );
      await annotationStore.createAnnotation(
        textSpan,
        annotationType,
        annotator,
        props.run.identifier,
        Number(route.params.documentId),
      );
    } else {
      console.error("no run id defined in createAnnotation");
    }
  } finally {
    showAnnotationModal.value = false;
  }
}
</script>
