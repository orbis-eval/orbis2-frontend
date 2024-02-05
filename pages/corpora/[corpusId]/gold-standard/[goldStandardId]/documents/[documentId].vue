<template>
  <NuxtLayout name="default-layout">
    <LoadingSpinner v-if="loading" class="mt-5" />
    <div v-else class="mt-5">
      <div
        class="mx-10 mb-10 flex-1 overflow-x-auto rounded-xl border-2 border-gray-600 bg-neutral"
      >
        <DocumentNavHeader
          @loadingFinished="loading = false"
          @loadingStarted="loading = true"
        >
        </DocumentNavHeader>
        <DocumentAnnotation
          :run="selectedGoldStandard"
          :highlighted-nested-set-node-id="highlightedNestedSetNodeId"
        >
        </DocumentAnnotation>
      </div>
    </div>
    <template #sidebar>
      <DocumentSidebar
        :loading="loading"
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

const route = useRoute();

const loading = ref(true);
const documentStore = useDocumentStore();
const corpusStore = useCorpusStore();
const runStore = useRunStore();
const { selectedGoldStandard } = storeToRefs(runStore);
const annotationStore = useAnnotationStore();
const colorPalettesStore = useColorPalettesStore();

const highlightedNestedSetNodeId = ref([] as number[]);

const { setTitle } = useTitle();
const { corpus } = storeToRefs(corpusStore);

onMounted(async () => {
  loading.value = true;
  try {
    setTitle(corpus.value.name);

    if (selectedGoldStandard.value.identifier) {
      await colorPalettesStore.loadColorPalettes();
    } else {
      console.log("Id of selected run was not set.");
    }
  } catch (error) {
    // Todo: Error Message for user
  } finally {
    loading.value = false;
  }
});

onBeforeUnmount(() => {
  annotationStore.resetAnnotationStack();
});

function setHighlightNestedSetNode(ids: number[]) {
  highlightedNestedSetNodeId.value = ids;
}
</script>