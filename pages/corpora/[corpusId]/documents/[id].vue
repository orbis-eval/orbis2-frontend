<template>
  <NuxtLayout name="sidebar">
    <LoadingSpinner v-if="!content"/>
    <div v-if="nestedSetRootNode">
      <h2 class="text-4xl p-4">Document</h2>
      <AnnotationNode :nestedSetNode="nestedSetRootNode"
                      @updateAnnotations="updateAnnotations"/>
    </div>
    <div v-else>
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
        <button @click="annotationStore.undoAnnotation(reload)">undo</button>
      </div>
      <div>
        <button @click="annotationStore.redoAnnotation(reload)">redo</button>
      </div>
      <div v-if="annotationStore.annotations">
        <h2 class="text-4xl">Annotations</h2>
        <table class="table-auto border-spacing-1 text-gray-500 dark:text-gray-400">
          <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 text-left">
            <tr>
              <th>start</th>
              <th>end</th>
              <th>surface</th>
            </tr>
          </thead>
          <tbody>
          <tr v-for="annotation in annotationStore.annotations" class="bg-gray-50 border-b dark:bg-gray-800 dark:border-gray-700">
            <td class="p-1">{{ annotation.start_indices[0] }}</td>
            <td class="p-1">{{ annotation.end_indices[0] }}</td>
            <td class="p-1">{{ annotation.surface_forms[0] }}</td>
          </tr>
          </tbody>
        </table>
      </div>
    </template>
  </NuxtLayout>
</template>

<script setup lang="ts">

import {Document} from "~/lib/model/document";
import {AnnotationType} from "~/lib/model/annotationType";
import {Annotator} from "~/lib/model/annotator";
import {NestedSetParseError} from "~/lib/model/nestedset/nestedSetParseError";
import {NestedSet} from "~/lib/model/nestedset/nestedSet";
import {Annotation} from "~/lib/model/annotation";
import {useAnnotationStore} from "~/stores/annotationStore";

const {$orbisApiService} = useNuxtApp();
const route = useRoute();

const content = ref(null);
const errorNodes = ref([]);
const nestedSetRootNode = ref(null);
const annotationStore = useAnnotationStore();

let annotationType: AnnotationType = new AnnotationType({
  name: "A Type",
  _id: 1
});

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
    annotationStore.redoAnnotation(reload);
  } else if (event.ctrlKey && event.key === 'z') {
    console.log('ctrl+z pressed');
    annotationStore.undoAnnotation(reload);
  }
};

onBeforeMount(() => {
  window.addEventListener('keydown', undoEventListener);
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', undoEventListener);
  annotationStore.$reset();
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

function reload() {
  nestedSetRootNode.value = NestedSet.toTree(
      annotationStore.annotations,
      content.value,
      1,
      1,
      new Date(),
      parseErrorCallBack
  );
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

function updateAnnotations(selection) {
  console.log(`${selection.word}:${selection.start}/${selection.end}, ${content.value.substring(selection.start, selection.end)}`);
  annotationStore.addAnnotation(
      mockAnnotation(selection.word, selection.start, selection.end, 1, annotationType, annotator)
  );
  reload();
}
</script>
