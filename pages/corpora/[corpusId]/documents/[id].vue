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
        <AnnotationModal
         ref="annotationTypeModal"
        :left-position="mousePosX"
        :top-position="mousePosY"
        :is-visible="showAnnotationModal"
        :annotation-types="mockAnnotationTypes"
        :selectionSurfaceForm="selectionSurfaceForm"
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
import {NestedSetNode} from "~/lib/model/nestedset/nestedSetNode";

addIcons(LaUndoAltSolid, LaRedoAltSolid)

const {$orbisApiService} = useNuxtApp();
const route = useRoute();

const content = ref(null);
const annotations = ref([] as Annotation[]);
const selection = ref(null);
const selectionSurfaceForm = ref('');
const relativeDiv = ref(null);
const mousePosX = ref(0);
const mousePosY = ref(0);
const showAnnotationModal = ref(false);
const recentlyStoredAnnotationId = ref(null);
const errorNodes = ref([]);
const nestedSetRootNode = ref(null);
const documentRuns = ref([] as Run[])
const annotationStore = useAnnotationStore();
const selectedRun = ref(annotationStore.selectedRun);
const annotationTypeModal = ref(null);
const selectedNode = ref(null);

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

const clickOutsideListener = (event) => {
  if(showAnnotationModal.value) {
    if(event.target === annotationTypeModal.value.$el || event.composedPath().includes(annotationTypeModal.value.$el)) {
      return;
    }
    if(event.target !== selection.value.selectionElement) { // only hide if the click does NOT come from the element where the text was selected
      showAnnotationModal.value = false;
    }
  }
}

onBeforeMount(() => {
  window.addEventListener('keydown', undoEventListener);
});

onMounted(() => {
  window.addEventListener('click', clickOutsideListener);
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', undoEventListener);
  window.removeEventListener('click', clickOutsideListener);
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
  const undoneAnnotationNode = annotationStore.undoAnnotation();
  if (undoneAnnotationNode) {
    $orbisApiService.removeAnnotationFromDocument(undoneAnnotationNode)
        .then(response => {
          if (response instanceof Error) {
            console.error(response.errorMessage);
            // redo annotation since it could not be removed from the database in the backend
            annotationStore.redoAnnotation();
          } else {
            // console.log(`removed annotation ${undoneAnnotationNode._id}`);
            // remove the annotation from the tree
            undoneAnnotationNode.parent.removeAnnotationNode(undoneAnnotationNode, parseErrorCallBack);
          }
        })
    }
  }

function redoAnnotation() {
  let redoneAnnotation = annotationStore.redoAnnotation();
  if (redoneAnnotation) {
    $orbisApiService.addAnnotation(redoneAnnotation)
        .then(annotationResponse => {
          if (annotationResponse instanceof Annotation) {
            // push redoneAnnotation, to keep the timestamp from previous set annotation otherwise annotations in
            // redone have different timestamps than in annotations -> conflicts in second undo / redo
            annotations.value.push(redoneAnnotation);
            reload();
          } else {
            console.error(annotationResponse.errorMessage);
            // undo annotation since it could not be stored in the backend
            annotationStore.undoAnnotation();
          }
        });
  }
}

function mockAnnotationNode(
    surfaceForm: string,
    start: number,
    end: number,
    id: number,
    annotationType: AnnotationType,
    annotator: Annotator): NestedSetNode {
  return new NestedSetNode(NestedSet.trimWithSpaces(new Annotation({
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
  })));
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

function updateAnnotations(currentSelection, node: NestedSetNode) {
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

async function commitAnnotationType(annotationType:AnnotationType) {
  //console.log(`selected annotation type: ${annotationType.name}, selection: ${selection.value.word}`);
  let annotationNode = mockAnnotationNode(selection.value.word, selection.value.start, selection.value.end, 1, annotationType, annotator)
  annotationNode.run_id = selectedRun.value._id;
  annotationNode.document_id = Number(route.params.id);
  $orbisApiService.addAnnotation(annotationNode)
      .then(annotationResponse => {
        if (annotationResponse instanceof Annotation) {
          annotationNode = new NestedSetNode(annotationResponse);

          // the the correct parent of the newly created node
          // annotationNode.parent = selectedNode.value.parent;

          // insert the node into the tree
           selectedNode.value.parent.insertAnnotationNode(annotationNode, (parseError: NestedSetParseError) => {
            console.warn("could not update the tree..."); // TODO: do proper error handling
          });

          // add to store for re- / undo
          annotationStore.addAnnotation(annotationNode);
          // hide the context menu
          showAnnotationModal.value = false;
          // console.log(`added annotation ${annotationNode._id}`);

        } else {
          // TODO, 06.01.2023 anf: correct error handling
          console.error(annotationResponse.errorMessage);
          // hide the context menu
          showAnnotationModal.value = false;
        }
      });
}
</script>
