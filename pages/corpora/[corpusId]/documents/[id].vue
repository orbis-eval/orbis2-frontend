<template>
  <NuxtLayout name="sidebar">
    <template #leftMenu>
      <LeftMenu :runs="documentRuns" :selected="selectedRun" @selectionChanged="selectedRunChanged"/>
    </template>
    <LoadingSpinner v-if="!content"/>
    <div
        v-if="nestedSetRootNode">
      <div class="relative" ref="relativeDiv">

        <!-- context modal gui for selecting the type -->
        <AnnotationModal v-if="showAnnotationModal"
        :left-position="mousePosX"
        :top-position="mousePosY"
        :is-visible="showAnnotationModal"
        :annotation-types="mockAnnotationTypes"
        @hideAnnotationModal="hideAnnotationModal"
        @commitAnnotationType="commitAnnotationType"/>

        <h2 class="text-4xl p-4">Document Test</h2>
        <AnnotationNode :nestedSetNode="nestedSetRootNode"
                        @updateAnnotations="updateAnnotations"/>
      </div>
    </div>
    <div v-else-if="errorNodes.length > 0">
      <h2 class="text-4xl">Tree could not be rendered</h2>
      Annotations that possibly are overlapping:
      <ul>
        <li v-for="node in errorNodes">
          {{node.surface_forms[0]}}:({{ node.start_indices[0] }}/{{ node.end_indices[0] }})
        </li>
      </ul>
    </div>
    <template #sidebar>
      <div>
        <button @click="undoAnnotation" class="small-button" >
          <OhVueIcon name="la-undo-alt-solid" />
        </button>
        <button @click="redoAnnotation" class="small-button">
          <OhVueIcon name="la-redo-alt-solid" />
        </button>
      </div>
      <div>
        {{ recentlyStoredAnnotationId }}
      </div>
      <div v-if="annotations">
        <h2 class="text-4xl">Annotations</h2>
        <table class="table-auto border-spacing-1 text-gray-500 dark:text-gray-400">
          <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 text-left">
            <tr>
              <th>start</th>
              <th>end</th>
              <th>surface</th>
              <th>type</th>
            </tr>
          </thead>
          <tbody>
          <tr v-for="annotation in annotations" class="bg-gray-50 border-b dark:bg-gray-800 dark:border-gray-700">
            <td class="p-1">{{ annotation.start_indices[0] }}</td>
            <td class="p-1">{{ annotation.end_indices[0] }}</td>
            <td class="p-1">{{ annotation.surface_forms[0] }}</td>
            <td class="p-1">{{ annotation.annotation_type.name}}</td>
          </tr>
          </tbody>
        </table>
      </div>
    </template>
  </NuxtLayout>
</template>

<script setup lang="ts">

import { OhVueIcon, addIcons } from "oh-vue-icons";
import { LaUndoAltSolid, LaRedoAltSolid } from "oh-vue-icons/icons"
import {Document} from "~/lib/model/document";
import {AnnotationType} from "~/lib/model/annotationType";
import {Annotator} from "~/lib/model/annotator";
import {NestedSetParseError} from "~/lib/model/nestedset/nestedSetParseError";
import {NestedSet} from "~/lib/model/nestedset/nestedSet";
import {Annotation} from "~/lib/model/annotation";
import {useAnnotationStore} from "~/stores/annotationStore";
import {Run} from "~/lib/model/run";
import {Corpus} from "~/lib/model/corpus";

addIcons(LaUndoAltSolid, LaRedoAltSolid)

const {$orbisApiService} = useNuxtApp();
const route = useRoute();

const content = ref(null);
const annotations = ref([] as Annotation[]);
const selection = ref(null);
const relativeDiv = ref(null);
const mousePosX = ref(0);
const mousePosY = ref(0);
const showAnnotationModal = ref(false);
const recentlyStoredAnnotationId = ref(null);
const errorNodes = ref([]);
const nestedSetRootNode = ref(null);
const documentRuns = ref([] as Run[])
const annotationStore = useAnnotationStore();
const selectedRun = ref(annotationStore.selectedRun)

let annotationType: AnnotationType = new AnnotationType({
  name: "Type A",
  _id: 1
});

const mockAnnotationTypes = ref([
    annotationType,
  new AnnotationType({
    name: "Type B",
    _id: 1
  }),
  new AnnotationType({
    name: "Type BC",
    _id: 3
  })
]);

let annotator: Annotator = new Annotator({
  name: "test annotator",
  roles: [],
  _id: 1
});

const parseErrorCallBack = (parseError: NestedSetParseError) => {
  errorNodes.value = parseError.nodes;
};

const undoEventListener = (event: KeyboardEvent) => {
  if (event.ctrlKey && event.shiftKey && event.key === 'Z') {
    redoAnnotation();
  } else if (event.ctrlKey && event.key === 'z') {
    undoAnnotation();
  }
};

onBeforeMount(() => {
  window.addEventListener('keydown', undoEventListener);
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', undoEventListener);
  annotationStore.resetAnnotationStack();
});

watch(content, async() => {
  reload();
});

$orbisApiService.getDocument(route.params.id)
    .then(document => {
      if (document instanceof Document) {
        content.value = document.content;
      } else {
        console.error(document.errorMessage);
        // TODO, 06.01.2023 anf: correct error handling
        content.value = 'ERROR';
      }
    });

$orbisApiService.getRuns(Number(route.params.corpusId))
    .then(runs => {
      if (Array.isArray(runs)) {
        documentRuns.value = runs;
        documentRuns.value.push(new Run({
          name: 'default run',
          description: 'empty default run',
          corpus: new Corpus({
            name: '',
            supported_annotation_types: [],
            _id: 0
          }),
          _id: 1
        }))
      } else {
        console.error(runs.errorMessage);
        documentRuns.value = [];
      }
    })

function reload() {
  nestedSetRootNode.value = NestedSet.toTree(
      annotations.value,
      content.value,
      1,
      1,
      new Date(),
      parseErrorCallBack
  );
}

function undoAnnotation() {
  const undoneAnnotation = annotationStore.undoAnnotation();
  if (undoneAnnotation) {
    const annotationIndex = annotations.value.indexOf(undoneAnnotation);
    if (annotationIndex >= 0) {
      annotations.value.splice(annotationIndex, 1);
      reload();
    }
  }
}
function redoAnnotation() {
  const redoneAnnotation = annotationStore.redoAnnotation();
  if (redoneAnnotation) {
    annotations.value.push(redoneAnnotation);
    reload();
  }

}

function mockAnnotation(
    surfaceForm: string,
    start: number,
    end: number,
    id: number,
    annotationType: AnnotationType,
    annotator: Annotator): Annotation {
  return NestedSet.trimWithSpaces(new Annotation({
    key: "",
    surface_forms: [surfaceForm],
    start_indices: [start],
    end_indices: [end],
    annotation_type: annotationType,
    annotator: annotator,
    run_id: 1,
    document_id: 1,
    metadata: [],
    timestamp: new Date(),
    _id: id
  }));
}

function selectedRunChanged(run: any) {
  if (run) {
    annotationStore.changeSelectedRun(run);
    selectedRun.value = run;
    $orbisApiService.getAnnotations(run._id, route.params.id)
        .then(annotationsFromDb => {
          if (Array.isArray(annotationsFromDb)) {
            annotations.value = annotationsFromDb;
            reload();
          } else {
            console.error(annotations.errorMessage);
          }
        })
  }
}

function hideAnnotationModal() {
  showAnnotationModal.value = false;
}

function updateAnnotations(currentSelection) {
  selection.value = currentSelection;
  showAnnotationModal.value = true;
  let relativeDivRect = relativeDiv.value.getBoundingClientRect();
  // console.log(`rect bounding: (left:${relativeDivRect.left}, top:${relativeDivRect.top}), selection: (x:${selection.event.clientX} y:${selection.event.clientY})`);
  let x = currentSelection.left - relativeDivRect.left;     // x/left position within the element.
  let y = currentSelection.top - relativeDivRect.top + 40;  // y/top position within the element, add 40px to position it under the selection
  mousePosX.value = x;
  mousePosY.value = y;
  // console.log(`${selection.word}:${selection.start}/${selection.end}, ${content.value.substring(selection.start, selection.end)}`);
}

async function commitAnnotationType(annotationType:AnnotationType) {
  //console.log(`selected annotation type: ${annotationType.name}, selection: ${selection.value.word}`);
  let annotation = mockAnnotation(selection.value.word, selection.value.start, selection.value.end, 1, annotationType, annotator)
  annotation.run_id = selectedRun.value._id;
  annotation.document_id = Number(route.params.id);
  // add to store for re- / undo and to annotations list for rendering the tree
  // (this will be refactored with adding directly to the tree)
  annotations.value.push(annotation);
  annotationStore.addAnnotation(
      annotation
  );

  // hide the context menu
  showAnnotationModal.value = false;

  $orbisApiService.addAnnotation(
      new Annotation(annotation))
      .then(annotationId => {
        if (annotationId instanceof Number) {
          recentlyStoredAnnotationId.value = annotationId;
        } else {
          console.error(annotationId.errorMessage);
          // TODO, 06.01.2023 anf: correct error handling
          recentlyStoredAnnotationId.value = 'ERROR';
        }
      });
  reload();
}
</script>
