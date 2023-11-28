<template>
  <NuxtLayout name="default-layout">
    <LoadingSpinner v-if="loading" class="mt-5" />
    <div v-else class="mt-5">
      <div
        class="mx-10 mb-10 flex-1 overflow-x-auto rounded-xl border-2 border-gray-600 bg-neutral p-5 flex"
        v-if="comparisonMode"
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
        <DocumentNavHeader
          @loadingFinished="loading = false"
          @loadingStarted="loading = true"
        >
        </DocumentNavHeader>
        <DocumentAnnotation
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
const { selectedRun, comparisonMode } = storeToRefs(runStore);
const annotationStore = useAnnotationStore();
const colorPalettesStore = useColorPalettesStore();

const highlightedNestedSetNodeId = ref([] as number[]);

const { setTitle } = useTitle();
const { corpus } = storeToRefs(corpusStore);

onMounted(async () => {
  loading.value = true;
  try {
    await corpusStore.loadCorpus(Number(route.params.corpusId));
    await runStore.loadRuns(Number(route.params.corpusId));
    await documentStore.loadDocument(Number(route.params.documentId));

    setTitle(corpus.value.name);

    if (selectedRun.value.identifier) {
      await documentStore.countDocuments(selectedRun.value.identifier);
      await colorPalettesStore.loadColorPalettes();

      if (documentStore.currentDocument.identifier) {
        await annotationStore.loadAnnotations(
          documentStore.currentDocument.identifier,
          documentStore.currentDocument.content,
          selectedRun.value.identifier,
          selectedRun.value.corpus.supportedAnnotationTypes,
        );
      } else {
        console.log("Id of current document was not set.");
      }
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
