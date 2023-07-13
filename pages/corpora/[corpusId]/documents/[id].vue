<template>
  <div>
    <template #leftMenu>
      <LeftMenu :runs="documentRuns" :selected="selectedRun" @selectionChanged="selectedRunChanged"
        @onDocumentsClicked="() => router.go(-1)" />
    </template>
    <LoadingSpinner v-if="!currentDocument" />

    <!-- previous / next document buttons -->
    <div class="p-4" v-if="selectedRun && currentDocument">
      Document: {{ currentDocument._id }}
      <button @click="previousDocument" class="small-button">
        <OhVueIcon name="md-navigatebefore-twotone" />
        previous
      </button>
      |
      <button @click="nextDocument" class="small-button">
        next
        <OhVueIcon name="md-navigatenext-twotone" />
      </button>
      Total Documents in Run: {{ documentsCount }}
    </div>

    <div
        v-if="nestedSetRootNode">
      <div class="relative" ref="relativeDiv">
        <div class="rounded-lg border border-gray-600 p-6">
          <!-- context modal gui for selecting the type -->
          <AnnotationModal
           ref="annotationTypeModal"
          :left-position="mousePosX"
          :top-position="mousePosY"
          :is-visible="showAnnotationModal"
          :annotation-types="annotationTypes"
          :selectionSurfaceForm="selectionSurfaceForm"
          @hideAnnotationModal="hideAnnotationModal"
          @commitAnnotationType="commitAnnotationType"/>

          <AnnotationNode :nestedSetNode="nestedSetRootNode"
                          :colorPalette = "currentColorPalette"
                          :highlightedNestedSetNodeId = "highlightedNestedSetNodeId"
                          @updateAnnotations="updateAnnotations"
                          @deleteAnnotation="deleteAnnotation"/>
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
      <Warning title="Please select a run."
               message="No run or default run is selected, in both cases annotation is not possible"
               confirm-text="ok" declineText="cancel"
               @confirm="wrongRunSelectedEnabled = false"
               @decline="wrongRunSelectedEnabled = false"/>
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
              @mouseover="highlightNestedSetNode(nestedSetNode._id)"
              @mouseleave="unsetHighlightedNestedSetNodeId()"
              @mouseout="unsetHighlightedNestedSetNodeId()"

          >
            <td class="p-2">
              <div class="rounded-lg w-10 h-10" :style="{background: '#'+currentColorPalette.getHexadecimalColorValue(nestedSetNode.annotation_type.color_id)}"></div>
            </td>
            <td class="p-2">{{ nestedSetNode.start_indices[0] }}</td>
            <td class="p-2">{{ nestedSetNode.end_indices[0] }}</td>
            <td class="p-2">{{ nestedSetNode.surface_forms[0] }}</td>
            <td class="p-2">{{ nestedSetNode.annotation_type.name}}</td>
            <td class="p-2">
              <button @click="deleteAnnotation(nestedSetNode)" class="small-button">
                Delete <OhVueIcon name="md-Deleteforever-outlined"/>
              </button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">

import {addIcons, OhVueIcon} from "oh-vue-icons";
import {LaRedoAltSolid, LaUndoAltSolid, MdNavigatebeforeTwotone, MdNavigatenextTwotone, MdDeleteforeverOutlined} from "oh-vue-icons/icons";
import {Document} from "~/lib/model/document";
import {AnnotationType} from "~/lib/model/annotationType";
import {Annotator} from "~/lib/model/annotator";
import {NestedSetParseError} from "~/lib/model/nestedset/nestedSetParseError";
import {NestedSet} from "~/lib/model/nestedset/nestedSet";
import {Annotation} from "~/lib/model/annotation";
import {useAnnotationStore} from "~/stores/annotationStore";
import {Run} from "~/lib/model/run";
import {NestedSetNode} from "~/lib/model/nestedset/nestedSetNode";
import {Error} from "~/lib/model/error";
import {ApiUtils} from "~/lib/utils/apiUtils";

addIcons(LaUndoAltSolid, LaRedoAltSolid, MdNavigatenextTwotone, MdNavigatebeforeTwotone, MdDeleteforeverOutlined);

const {$orbisApiService} = useNuxtApp();
const route = useRoute();
const router = useRouter();

const currentDocument = ref(null);
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
const wrongRunSelectedEnabled = ref(false);
const annotationTypes = ref([]);
const documentsCount=ref(null);
const colorPalettes=ref([]);
const currentColorPalette=ref(null);
const highlightedNestedSetNodeId=ref(null);

// TODO: use the annotator loaded from the backend
let annotator: Annotator = new Annotator({
  name: "test annotator",
  roles: []
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
  loadDocument();
  loadRuns();
  loadColorPalettes();
});

onMounted(() => {
  window.addEventListener('click', clickOutsideListener);
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', undoEventListener);
  window.removeEventListener('click', clickOutsideListener);
  annotationStore.resetAnnotationStack();
});


function highlightNestedSetNode(id: number) {
  highlightedNestedSetNodeId.value = id;
}

function unsetHighlightedNestedSetNodeId() {
  highlightedNestedSetNodeId.value = null;
}

function loadDocument() {
  $orbisApiService.getDocument(route.params.id)
      .then(document => {
        if (document instanceof Document) {
          currentDocument.value = document;
          reload([]);
        } else {
          console.error(document.errorMessage);
          // TODO, 06.01.2023 anf: correct error handling
          currentDocument.value.content = 'ERROR';
        }
      });
}

function loadRuns() {
  ApiUtils.getRuns(route.params.corpusId, documentRuns, $orbisApiService);
}

function loadColorPalettes() {
  $orbisApiService.colorPalettes().then(loadedColorPalettes => {
    console.log(JSON.stringify(loadedColorPalettes));
    colorPalettes.value = loadedColorPalettes;
    // TODO: make selectable in GUI
    currentColorPalette.value = colorPalettes.value[0];
  })
}

function reload(annotations: Annotation[]) {
  // assign the color-id value based on the supported_annotation_types to every annotation
  annotations = annotations.map(annotation => {
    annotation.annotation_type.color_id =
        annotationTypes.value.
        find(annotationType => annotationType.name === annotation.annotation_type.name)
            .color_id;
    return annotation;
  });
  // calculate the root-node
  nestedSetRootNode.value = NestedSet.toTree(
      annotations,
      currentDocument.value.content,
      selectedRun.value,
      1,
      new Date(),
      parseErrorCallBack
  );
}

function undoAnnotation() {
  removeAnnotation(annotationStore.undoAnnotation());
}

function deleteAnnotation(nestedSetNode: NestedSetNode) {
  // TODO: implement undo functionality for deleted annotations
  // annotationStore.addAnnotation(nestedSetNode);
  removeAnnotation(nestedSetNode);
}

function removeAnnotation(nestedSetNode: NestedSetNode) {
  $orbisApiService.removeAnnotationFromDocument(nestedSetNode.toAnnotation())
      .then(response => {
        if (response instanceof Error) {
          console.error(response.errorMessage);
          // redo annotation since it could not be removed from the database in the backend
          annotationStore.redoAnnotation();
        } else {
          // remove the annotation from the tree
          nestedSetNode.parent.removeAnnotationNode(nestedSetNode, parseErrorCallBack);
        }
      });
}

function redoAnnotation() {
  let redoneAnnotationNode = annotationStore.redoAnnotation();
  if (redoneAnnotationNode) {
    $orbisApiService.addAnnotation(redoneAnnotationNode.toAnnotation())
        .then(annotationResponse => {
          if (annotationResponse instanceof Annotation) {
            // push redoneAnnotation, to keep the timestamp from previous set annotation otherwise annotations in
            // redone have different timestamps than in annotations -> conflicts in second undo / redo

            // calculate the parent from scratch as the tree potentially can change
            const parent = NestedSet.getParent(nestedSetRootNode.value, redoneAnnotationNode, parseErrorCallBack);
            // insert the node into the parent
            parent.insertAnnotationNode(redoneAnnotationNode, parseErrorCallBack);
            // console.log(`re-added annotation "${redoneAnnotationNode.surface_forms[0]}" into parent ${redoneAnnotationNode.parent.surface_forms[0]}`)
          } else {
            console.error(annotationResponse.errorMessage);
            // undo annotation since it could not be stored in the backend
            annotationStore.undoAnnotation();
          }
        });
  }
}

function nextDocument() {
  $orbisApiService.nextDocument(selectedRun.value._id, currentDocument.value._id).then(document => {
    navigateToDocument(document);
  });
}

function previousDocument() {
  $orbisApiService.previousDocument(selectedRun.value._id, currentDocument.value._id).then(document => {
    navigateToDocument(document);
  });
}

function navigateToDocument(document: Document) {
  router.push({ path: `/corpora/${route.params.corpusId}/documents/${document._id}` });
}

/**
 * called when a new annotation was added in GUI
 */
function createNestedSetNode(
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

/**
 * called when the run changes. will load all annotations for given run from the backend
 * and re-render the tree with those
 * @param run the run that was selected
 */
function selectedRunChanged(run: any) {
  if (run && run._id) {

    annotationStore.changeSelectedRun(run);
    annotationTypes.value = run.corpus.supported_annotation_types;
    selectedRun.value = run;

    // load the annotations
    $orbisApiService.getAnnotations(run._id, route.params.id)
        .then(annotationsFromDb => {
          if (Array.isArray(annotationsFromDb)) {
            console.log(`annotations loaded from db: ${JSON.stringify(annotationsFromDb)}`);
            // reload the annotations
            reload(annotationsFromDb);
          } else {
            console.error(annotationsFromDb.errorMessage);
          }
        });

    // load the total documents count for given run
    $orbisApiService.countDocuments(run._id).then(documentCount => {
          documentsCount.value = documentCount;
        }
    );
  }
}

function hideAnnotationModal() {
  showAnnotationModal.value = false;
}

function updateAnnotations(currentSelection, node: NestedSetNode) {
  if (!(selectedRun.value instanceof Run) || selectedRun.value.name.includes('default')) {
    console.log("wrong run selected")
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
async function commitAnnotationType(annotationType: AnnotationType) {
  //console.log(`selected annotation type: ${annotationType.name}, selection: ${selection.value.word}`);
  let annotation = createNestedSetNode(selection.value.word, selection.value.start, selection.value.end, 1, annotationType, annotator)
      .toAnnotation();
  annotation.run_id = selectedRun.value._id;
  annotation.document_id = Number(route.params.id);
  $orbisApiService.addAnnotation(annotation)
      .then(annotationResponse => {

      if (annotationResponse instanceof Annotation) {
        let annotationNode = new NestedSetNode(annotationResponse);

        if (annotation.annotation_type.color_id) {
          annotationNode.annotation_type.color_id = annotation.annotation_type.color_id;
        }

        let nodeToInsert = selectedNode.value;
        // if the selection was made in a GAP_ANNOTATION, we need to add it to the parent of the gap-annotation
        if (nodeToInsert.annotation_type.name === NestedSet.GAP_ANNOTATION_TYPE_NAME) {
          nodeToInsert = selectedNode.value.parent;
        }

          // add the new node as child
          nodeToInsert.insertAnnotationNode(annotationNode, (parseError: NestedSetParseError) => {
            console.warn(`could not update the tree, error: ${JSON.stringify(parseError)}`); // TODO: do proper error handling
          });
          // console.log(`inserted ${annotationNode.surface_forms[0]} into tree, parend node ${nodeToInsert.annotation_type.name}`);

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
