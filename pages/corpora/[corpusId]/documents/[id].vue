<template>
  <NuxtLayout name="default-layout">
    <LoadingSpinner v-if="loading" class="mt-5" />
    <div v-else class="mt-5">
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
import { useRunStore } from "~/stores/runStore";
import { useDocumentStore } from "~/stores/documentStore";
import { useColorPalettesStore } from "~/stores/colorPalettesStore";

const { $orbisApiService } = useNuxtApp();
const route = useRoute();

const loading = ref(true);
const documentStore = useDocumentStore();
const runStore = useRunStore();
const { selectedRun } = storeToRefs(runStore);
const annotationStore = useAnnotationStore();
const colorPalettesStore = useColorPalettesStore();

const highlightedNestedSetNodeId = ref(-1);

onMounted(async () => {
  loading.value = true;
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
