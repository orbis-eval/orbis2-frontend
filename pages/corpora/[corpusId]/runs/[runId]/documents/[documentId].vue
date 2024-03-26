<template>
  <NuxtLayout name="default-layout">
    <div class="mt-5">
      <div
        class="mx-10 mb-10 flex flex-1 overflow-x-auto rounded-xl border-2 border-gray-600 bg-neutral p-5"
      >
        <table class="table">
          <tr>
            <th>True Positive</th>
            <th>False Positive</th>
            <th>False Negative</th>
          </tr>
          <tr>
            <td class="py-0">{{ currentDocument.scoring.tp.length }}</td>
            <td class="py-0">{{ currentDocument.scoring.fp.length }}</td>
            <td class="py-0">{{ currentDocument.scoring.fn.length }}</td>
          </tr>
          <tr>
            <th>F1 Score</th>
            <th>Precision</th>
            <th>Recall</th>
          </tr>
          <tr>
            <td class="py-0">{{ calcF1Score.toFixed(2) }}</td>
            <td class="py-0">{{ calcPrecision.toFixed(2) }}</td>
            <td class="py-0">{{ calcRecall.toFixed(2) }}</td>
          </tr>
        </table>
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
import { useRunStore } from "~/stores/runStore";
import { useDocumentStore } from "~/stores/documentStore";
import { onMounted } from "#imports";

const runStore = useRunStore();
const { selectedRun } = storeToRefs(runStore);
const annotationStore = useAnnotationStore();

const documentStore = useDocumentStore();
const { currentDocument } = storeToRefs(documentStore);

const highlightedNestedSetNodeId = ref([] as number[]);

function setHighlightNestedSetNode(ids: number[]) {
  highlightedNestedSetNodeId.value = ids;
}

onMounted(() => {
  if (annotationStore.selectedAnnotation) {
    const ids: number[] = [];
    if (annotationStore.selectedAnnotation.identifier) {
      ids.push(annotationStore.selectedAnnotation.identifier);
    }
    setHighlightNestedSetNode(ids);
  }
});

onBeforeUnmount(() => {
  annotationStore.resetAnnotationStack();
});

const calcRecall = computed(() => {
  return (
    currentDocument.value.scoring.tp.length /
    (currentDocument.value.scoring.tp.length + currentDocument.value.scoring.fn.length)
  );
});

const calcPrecision = computed(() => {
  return (
    currentDocument.value.scoring.tp.length /
    (currentDocument.value.scoring.tp.length + currentDocument.value.scoring.fp.length)
  );
});

const calcF1Score = computed(() => {
  return (
    (2 * calcPrecision.value * calcRecall.value) /
    (calcPrecision.value + calcRecall.value)
  );
});
</script>
