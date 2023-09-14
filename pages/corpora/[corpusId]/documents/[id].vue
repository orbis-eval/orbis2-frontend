<template>
  <NuxtLayout name="default-layout">
    <!--    <template #leftMenu>-->
    <!--      <LeftMenu :runs="documentRuns" :selected="selectedRun" @selectionChanged="selectedRunChanged"-->
    <!--                @onDocumentsClicked="() => router.go(-1)"/>-->
    <!--    </template>-->
    <LoadingSpinner v-if="loading"/>
    <div v-else class="mt-20">
      <!-- previous / next document buttons -->
      <div v-if="selectedRun && currentDocument" class="p-4">
        Document: {{ currentDocument._id }}
        <button class="small-button" @click="previousDocument">
          <OhVueIcon name="md-navigatebefore-twotone"/>
          previous
        </button>
        |
        <button class="small-button" @click="nextDocument">
          next
          <OhVueIcon name="md-navigatenext-twotone"/>
        </button>
        Total Documents in Run: {{ nrOfDocuments }}
      </div>

      <div v-if="nestedSetRootNode">
        <div ref="relativeDiv" class="relative">
          <div class="rounded-lg border border-gray-600 p-6">
            <!-- context modal gui for selecting the type -->
            <AnnotationModal
                ref="annotationTypeModal"
                :annotationTypes="selectedRun.corpus.supported_annotation_types"
                :isVisible="showAnnotationModal"
                :leftPosition="mousePosX"
                :selectionSurfaceForm="selectionSurfaceForm"
                :topPosition="mousePosY"
                @commitAnnotationType="addAnnotation"
                @hideAnnotationModal="hideAnnotationModal"/>

            <AnnotationNode :colorPalette="currentColorPalette"
                            :highlightedNestedSetNodeId="highlightedNestedSetNodeId"
                            :nestedSetNode="nestedSetRootNode"
                            @deleteAnnotation="deleteAnnotation"
                            @updateAnnotations="updateAnnotations"/>
          </div>
        </div>
      </div>
      <div v-else-if="errorNodes.length > 0">
        <h2 class="text-4xl">Tree could not be rendered</h2>
        Annotations that possibly are overlapping:
        <ul>
          <li v-for="node in errorNodes">
            {{ node.surface_forms[0] }}:({{ node.start_indices[0] }}/{{ node.end_indices[0] }})
          </li>
        </ul>
      </div>
      <div v-if="wrongRunSelectedEnabled" class="fixed inset-0 flex items-center justify-center z-50">
        <Warning confirmText="ok"
                 declineText="cancel"
                 message="No run or default run is selected, in both cases annotation is not possible"
                 title="Please select a run."
                 @confirm="wrongRunSelectedEnabled = false"
                 @decline="wrongRunSelectedEnabled = false"/>
      </div>
    </div>
    <template #sidebar>
      <div v-if="!loading">
        <div class="mt-20">
          <button :class="{'btn-disabled': isUndoDisabled}"
                  :disabled="isUndoDisabled"
                  class="small-button"
                  @click="undoAnnotation" >
            <OhVueIcon name="la-undo-alt-solid"/>
          </button>
          <button :class="{'btn-disabled': isRedoDisabled}"
                  :disabled="isRedoDisabled"
                  class="small-button"
                  @click="redoAnnotation">
            <OhVueIcon name="la-redo-alt-solid"/>
          </button>
        </div>
        <div>
          {{ recentlyStoredAnnotationId }}
        </div>
        <div v-if="nestedSetRootNode">
          <h2 class="text-4xl p-2">Annotations</h2>
          <table class="table-auto border-spacing-1 text-gray-500 dark:text-gray-400">
            <thead class="text-lg text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 text-left">
            <tr>
              <th class="p-2"></th>
              <th class="p-2">start</th>
              <th class="p-2">end</th>
              <th class="p-2">surface</th>
              <th class="p-2">type</th>
              <th class="p-2"></th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="nestedSetNode in nestedSetRootNode.allAnnotationNodes()"
                class="bg-gray-50 border-b dark:bg-gray-800 dark:border-gray-700 hover:underline"
                @mouseleave="unsetHighlightedNestedSetNodeId()"
                @mouseout="unsetHighlightedNestedSetNodeId()"
                @mouseover="highlightNestedSetNode(nestedSetNode._id)">
              <td class="p-2">
                <div
                    :style="{background: '#'+currentColorPalette.getHexadecimalColorValue(nestedSetNode.annotation_type.color_id)}"
                    class="rounded-lg w-10 h-10"></div>
              </td>
              <td class="p-2">{{ nestedSetNode.start_indices[0] }}</td>
              <td class="p-2">{{ nestedSetNode.end_indices[0] }}</td>
              <td class="p-2">{{ nestedSetNode.surface_forms[0] }}</td>
              <td class="p-2">{{ nestedSetNode.annotation_type.name }}</td>
              <td class="p-2">
                <button class="small-button" @click="deleteAnnotation(nestedSetNode)">
                  Delete
                  <OhVueIcon name="md-deleteforever-outlined"/>
                </button>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>
    <!--    <template #sidebar>-->
    <!--      <DocumentSidebar></DocumentSidebar>-->
    <!--    </template>-->
  </NuxtLayout>
</template>

<script setup lang="ts">

import {addIcons, OhVueIcon} from "oh-vue-icons";
import {
  LaRedoAltSolid,
  LaUndoAltSolid,
  MdNavigatebeforeTwotone,
  MdNavigatenextTwotone,
  MdDeleteforeverOutlined
} from "oh-vue-icons/icons";
import {AnnotationType} from "~/lib/model/annotationType";
import {Annotator} from "~/lib/model/annotator";
import {useAnnotationStore} from "~/stores/annotationStore";
import {Run} from "~/lib/model/run";
import {NestedSetNode} from "~/lib/model/nestedset/nestedSetNode";
import {storeToRefs} from "pinia";
import {useRunStore} from "~/stores/runStore";
import {useDocumentStore} from "~/stores/documentStore";
import {useColorPalettesStore} from "~/stores/colorPalettesStore";

addIcons(LaUndoAltSolid, LaRedoAltSolid, MdNavigatenextTwotone, MdNavigatebeforeTwotone, MdDeleteforeverOutlined);

const {$orbisApiService} = useNuxtApp();
const route = useRoute();

const loading = ref(true);
const selection = ref(null);
const selectionSurfaceForm = ref('');
const relativeDiv = ref(null);
const mousePosX = ref(0);
const mousePosY = ref(0);
const showAnnotationModal = ref(false);
const recentlyStoredAnnotationId = ref(null);
const errorNodes = ref([]);
const documentStore = useDocumentStore();
const {currentDocument, nrOfDocuments} = storeToRefs(documentStore);
const runStore = useRunStore();
const {selectedRun} = storeToRefs(runStore);
const annotationStore = useAnnotationStore();
const {nestedSetRootNode, isUndoDisabled, isRedoDisabled} = storeToRefs(annotationStore);
const colorPalettesStore = useColorPalettesStore();
const {currentColorPalette} = storeToRefs(colorPalettesStore);

const annotationTypeModal = ref(null);
const selectedNode = ref(null);
const wrongRunSelectedEnabled = ref(false);
const highlightedNestedSetNodeId = ref(null);

onBeforeMount(() => {
  window.addEventListener('keydown', undoEventListener);
});

onMounted(async () => {
  window.addEventListener('click', clickOutsideListener);
  loading.value = true;
  try {
    await runStore.loadRuns(route.params.corpusId, $orbisApiService);
    await documentStore.loadDocument(route.params.id, $orbisApiService);
    await documentStore.countDocuments(selectedRun.value._id, $orbisApiService);
    await colorPalettesStore.loadColorPalettes($orbisApiService);
    await annotationStore.loadAnnotations($orbisApiService);
  } catch (Error) {
    // Todo: Error Message for user
  } finally {
    loading.value = false;
  }
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', undoEventListener);
  window.removeEventListener('click', clickOutsideListener);
  annotationStore.resetAnnotationStack();
});

// TODO: use the annotator loaded from the backend
let annotator: Annotator = new Annotator({
  name: "test annotator",
  roles: []
});

const undoEventListener = (event: KeyboardEvent) => {
  if (event.ctrlKey && event.shiftKey && event.key === 'Z') {
    redoAnnotation();
  } else if (event.ctrlKey && event.key === 'z') {
    undoAnnotation();
  }
};

const clickOutsideListener = (event) => {
  if (showAnnotationModal.value) {
    if (event.target === annotationTypeModal.value.$el || event.composedPath().includes(annotationTypeModal.value.$el)) {
      return;
    }
    if (event.target !== selection.value.selectionElement) { // only hide if the click does NOT come from the element where the text was selected
      showAnnotationModal.value = false;
    }
  }
};

function highlightNestedSetNode(id: number) {
  highlightedNestedSetNodeId.value = id;
}

function unsetHighlightedNestedSetNodeId() {
  highlightedNestedSetNodeId.value = null;
}

async function undoAnnotation() {
  await annotationStore.undoAnnotation()
}

async function redoAnnotation() {
  await annotationStore.redoAnnotation();
}

async function deleteAnnotation(nestedSetNode: NestedSetNode) {
  await annotationStore.deleteAnnotation(nestedSetNode, $orbisApiService);
}

async function nextDocument() {
  await documentStore.nextDocument(selectedRun.value._id, $orbisApiService);
  await reloadAnnotations();
}

async function previousDocument() {
  await documentStore.previousDocument(selectedRun.value._id, $orbisApiService);
  await reloadAnnotations();
}

async function reloadAnnotations() {
  annotationStore.resetAnnotationStack();
  await annotationStore.loadAnnotations($orbisApiService);
}

function hideAnnotationModal() {
  showAnnotationModal.value = false;
}

function updateAnnotations(currentSelection, node: NestedSetNode) {
  if (!(selectedRun.value instanceof Run) || selectedRun.value.name.includes('default')) {
    console.log("wrong run selected");
    wrongRunSelectedEnabled.value = true;
  } else {
    selection.value = currentSelection;
    selectionSurfaceForm.value = selection.value.word;
    showAnnotationModal.value = true;
    let relativeDivRect = relativeDiv.value.getBoundingClientRect();
    // console.log(`rect bounding: (left:${relativeDivRect.left}, top:${relativeDivRect.top}), selection: (x:${selection.event.clientX} y:${selection.event.clientY})`);
    let x = currentSelection.left - relativeDivRect.left;     // x/left position within the element.
    let y = currentSelection.top - relativeDivRect.top + 25;  // y/top position within the element, add 40px to position it under the selection
    mousePosX.value = x;
    mousePosY.value = y;
    // console.log(`${selection.word}:${selection.start}/${selection.end}, ${content.value.substring(selection.start, selection.end)}`);
    selectedNode.value = node;
  }
}

// called when adding a new annotation
async function addAnnotation(annotationType: AnnotationType) {
  try {
    await annotationStore.addAnnotation(selection.value.word, selection.value.start, selection.value.end,
        annotationType, annotator, selectedRun.value._id, Number(route.params.id), selectedNode.value, $orbisApiService);
  } finally {
    showAnnotationModal.value = false;
  }
}

</script>
