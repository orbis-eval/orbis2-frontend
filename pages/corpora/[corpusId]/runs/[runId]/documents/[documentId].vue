<template>
  <NuxtLayout name="default-layout">
    <div>
      <div
        class="mb-4 flex flex-1 rounded-xl border-2 border-gray-600 bg-base-300 p-5 dark:bg-neutral p-5"
      >
        <table class="table">
          <tr>
            <th class="py-0">True Positive</th>
            <th class="py-0">False Positive</th>
            <th class="py-0">False Negative</th>
          </tr>
          <tr>
            <td class="py-0">{{ getTPCount }}</td>
            <td class="py-0">{{ getFPCount }}</td>
            <td class="py-0">{{ getFNCount }}</td>
          </tr>
          <tr>
            <th class="py-0 pt-3">F1 Score</th>
            <th class="py-0 pt-3">Precision</th>
            <th class="py-0 pt-3">Recall</th>
          </tr>
          <tr>
            <td class="py-0">{{ calcF1Score.toFixed(2) }}</td>
            <td class="py-0">{{ calcPrecision.toFixed(2) }}</td>
            <td class="py-0">{{ calcRecall.toFixed(2) }}</td>
          </tr>
        </table>
      </div>
      <div
        class="mx-10 mb-10 flex-1 overflow-x-auto rounded-xl border-2 border-gray-600 bg-base-300 dark:bg-neutral"
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

const getTPCount = computed(() => {
  if (currentDocument.value.scoring) {
    return currentDocument.value.scoring.tp.length;
  }
  return 0;
});

const getFPCount = computed(() => {
  if (currentDocument.value.scoring) {
    return currentDocument.value.scoring.fp.length;
  }
  return 0;
});

const getFNCount = computed(() => {
  if (currentDocument.value.scoring) {
    return currentDocument.value.scoring.fn.length;
  }
  return 0;
});

const calcRecall = computed(() => {
  if (currentDocument.value.scoring) {
    return (
      currentDocument.value.scoring.tp.length /
      (currentDocument.value.scoring.tp.length +
        currentDocument.value.scoring.fn.length)
    );
  }
  return 0;
});

const calcPrecision = computed(() => {
  if (currentDocument.value.scoring) {
    return (
      currentDocument.value.scoring.tp.length /
      (currentDocument.value.scoring.tp.length +
        currentDocument.value.scoring.fp.length)
    );
  }
  return 0;
});

const calcF1Score = computed(() => {
  if (calcRecall.value + calcPrecision.value === 0) {
    return 0;
  }
  return (
    (2 * calcRecall.value * calcPrecision.value) /
    (calcRecall.value + calcPrecision.value)
  );
});
</script>
