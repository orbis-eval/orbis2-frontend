<template>
  <NuxtLayout name="default-layout">
    <div class="mt-5">
      <div
        class="mx-10 mb-10 flex-1 overflow-x-auto rounded-xl border-2 border-gray-600"
      >
        <DocumentNavHeader />
        <DocumentAnnotation
          :run="selectedGoldStandard"
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
import { onMounted } from "#imports";

const runStore = useRunStore();
const { selectedGoldStandard } = storeToRefs(runStore);
const annotationStore = useAnnotationStore();

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
</script>
