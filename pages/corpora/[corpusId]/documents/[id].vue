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

const { $orbisApiService } = useNuxtApp();
const route = useRoute();

const loading = ref(true);
const documentStore = useDocumentStore();
const corpusStore = useCorpusStore();
const runStore = useRunStore();
const { selectedRun } = storeToRefs(runStore);
const annotationStore = useAnnotationStore();
const colorPalettesStore = useColorPalettesStore();

const highlightedNestedSetNodeId = ref(-1);

const { setTitle } = useTitle();
const { corpus } = storeToRefs(corpusStore);

onMounted(async () => {
  loading.value = true;
  setTitle(corpus.value.name);
  try {
    await runStore.loadRuns(Number(route.params.corpusId), $orbisApiService);
    await documentStore.loadDocument(Number(route.params.id), $orbisApiService);

    if (selectedRun.value.id) {
      await documentStore.countDocuments(
        selectedRun.value.id,
        $orbisApiService,
      );
      await colorPalettesStore.loadColorPalettes($orbisApiService);

      if (documentStore.currentDocument.id) {
        await annotationStore.loadAnnotations(
          documentStore.currentDocument.id,
          documentStore.currentDocument.content,
          selectedRun.value.id,
          selectedRun.value.corpus.supportedAnnotationTypes,
          $orbisApiService,
        );
      } else {
        console.log("Id of current document was not set.");
      }
    } else {
      console.log("Id of selected run was not set.");
    }
  } catch (Error) {
    // Todo: Error Message for user
  } finally {
    loading.value = false;
  }
});

onBeforeUnmount(() => {
  annotationStore.resetAnnotationStack();
});

function setHighlightNestedSetNode(id: number) {
  highlightedNestedSetNodeId.value = id;
}
</script>
