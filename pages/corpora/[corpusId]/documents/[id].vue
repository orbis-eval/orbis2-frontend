<template>
  <NuxtLayout name="default-layout">
    <LoadingSpinner v-if="loading" class="mt-5"/>
    <div v-else class="mt-5">
      <DocumentNavHeader @loadingFinished="loading = false"
                         @loadingStarted="loading = true">
      </DocumentNavHeader>
      <DocumentAnnotation :highlightedNestedSetNodeId="highlightedNestedSetNodeId">
      </DocumentAnnotation>
    </div>
    <template #sidebar>
      <DocumentSidebar :loading="loading"
                       @setHighlightNestedSetNode="setHighlightNestedSetNode"></DocumentSidebar>
    </template>
  </NuxtLayout>
</template>

<script setup lang="ts">

import {useAnnotationStore} from "~/stores/annotationStore";
import {storeToRefs} from "pinia";
import {useRunStore} from "~/stores/runStore";
import {useDocumentStore} from "~/stores/documentStore";
import {useColorPalettesStore} from "~/stores/colorPalettesStore";

const {$orbisApiService} = useNuxtApp();
const route = useRoute();

const loading = ref(true);
const documentStore = useDocumentStore();
const runStore = useRunStore();
const {selectedRun} = storeToRefs(runStore);
const annotationStore = useAnnotationStore();
const colorPalettesStore = useColorPalettesStore();

const highlightedNestedSetNodeId = ref(null);


onMounted(async () => {
  loading.value = true;
  try {
    await runStore.loadRuns(route.params.corpusId, $orbisApiService);
    await documentStore.loadDocument(route.params.id, $orbisApiService);
    await documentStore.countDocuments(selectedRun.value._id, $orbisApiService);
    await colorPalettesStore.loadColorPalettes($orbisApiService);
    await annotationStore.loadAnnotations(documentStore.currentDocument._id,
        documentStore.currentDocument.content, selectedRun.value._id,
        selectedRun.value.corpus.supported_annotation_types,
        $orbisApiService);
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
