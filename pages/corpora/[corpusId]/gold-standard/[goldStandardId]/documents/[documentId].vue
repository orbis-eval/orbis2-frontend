<template>
  <NuxtLayout name="default-layout">
    <div>
      <div
        class="mb-4 flex-1 rounded-xl border-2 border-gray-600 bg-base-300 dark:bg-neutral"
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
import { useGoldStandardStore } from "~/stores/goldStandardStore";
import { onMounted } from "#imports";
import { useCorpusStore } from "~/stores/corpusStore";
import { useDocumentStore } from "~/stores/documentStore";

const goldStandardStore = useGoldStandardStore();
const { selectedGoldStandard } = storeToRefs(goldStandardStore);
const annotationStore = useAnnotationStore();

const corpusStore = useCorpusStore();
const { corpus } = storeToRefs(corpusStore);

const documentStore = useDocumentStore();
const { currentDocument } = storeToRefs(documentStore);

const highlightedNestedSetNodeId = ref([] as number[]);

useTitle(
  `Document: ${currentDocument.value.identifier} `,
  `${corpus.value.name} | ${selectedGoldStandard.value.name} | ${currentDocument.value.identifier}`,
);

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
