<template>
  <NuxtLayout name="default-layout">
    <div class="mt-5">
      <div
        class="mx-10 mb-10 flex flex-1 overflow-x-auto rounded-xl border-2 border-gray-600 bg-neutral p-5"
      >
        <div class="w-6/12">
          <p><b>F1 Score:</b> 0.81 / 0.82</p>
          <p><b>Precision:</b> 0.81 / 0.82</p>
          <p><b>Recall:</b> 0.81 / 0.82</p>
          <p><b>Accuracy:</b> 0.81 / 0.82</p>
        </div>
        <div class="w-6/12">
          <p><b>True Positive:</b> 2</p>
          <p><b>False Positive: </b> 1</p>
          <p><b>False Negative:</b> 1</p>
        </div>
      </div>
      <div
        class="mx-10 mb-10 flex-1 overflow-x-auto rounded-xl border-2 border-gray-600 bg-neutral"
      >
        <DocumentNavHeader />
        <DocumentAnnotation
          :run="selectedRun"
          :highlighted-nested-set-node-id="highlightedNestedSetNodeId"
        >
        </DocumentAnnotation>
      </div>
    </div>
    <template #sidebar>
      <DocumentSidebar
        @setHighlightNestedSetNode="setHighlightNestedSetNode"
      ></DocumentSidebar>
    </template>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useAnnotationStore } from "~/stores/annotationStore";
import { useCorpusStore } from "~/stores/corpusStore";
import { useRunStore } from "~/stores/runStore";
import { useDocumentStore } from "~/stores/documentStore";
import { useColorPalettesStore } from "~/stores/colorPalettesStore";
import { useTitle } from "~/composables/title";
import {onMounted} from "#imports";

const route = useRoute();
const { $progress } = useNuxtApp();
const documentStore = useDocumentStore();
const runStore = useRunStore();
const { selectedRun } = storeToRefs(runStore);
const annotationStore = useAnnotationStore();

const highlightedNestedSetNodeId = ref([] as number[]);

onMounted(() => {
  if (annotationStore.selectedAnnotation) {
    let ids : number[] = [];
    if (annotationStore.selectedAnnotation.identifier) {
      ids.push(annotationStore.selectedAnnotation.identifier);
    }
    setHighlightNestedSetNode(ids);
  }
});

onBeforeUnmount(() => {
  annotationStore.resetAnnotationStack();
});

function setHighlightNestedSetNode(ids: number[]) {
  highlightedNestedSetNodeId.value = ids;
}
</script>
