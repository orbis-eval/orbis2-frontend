<template>
  <div v-if="selectedRun && currentDocument" class="p-4">
    Document: {{ currentDocument._id }}
    <button class="small-button" @click="previousDocument">
      <OhVueIcon name="md-navigatebefore-twotone"/>
      previous
    </button>
    |
    <button class="small-button" @click="nextDocument">
      next
      <OhVueIcon name="md-navigatenext-twotone"/>
    </button>
    Total Documents in Run: {{ nrOfDocuments }}
  </div>
</template>

<script lang="ts" setup>

import {
  MdNavigatebeforeTwotone,
  MdNavigatenextTwotone,
} from "oh-vue-icons/icons";
import {useDocumentStore} from "~/stores/documentStore";
import {storeToRefs} from "pinia";
import {useRunStore} from "~/stores/runStore";
import {useAnnotationStore} from "~/stores/annotationStore";
import {addIcons, OhVueIcon} from "oh-vue-icons";

const {$orbisApiService} = useNuxtApp();
addIcons(MdNavigatenextTwotone, MdNavigatebeforeTwotone);

const documentStore = useDocumentStore();
const {currentDocument, nrOfDocuments} = storeToRefs(documentStore);
const runStore = useRunStore();
const {selectedRun} = storeToRefs(runStore);
const annotationStore = useAnnotationStore();

async function nextDocument() {
  await documentStore.nextDocument(selectedRun.value._id, $orbisApiService);
  await reloadAnnotations();
}

async function previousDocument() {
  await documentStore.previousDocument(selectedRun.value._id, $orbisApiService);
  await reloadAnnotations();
}

async function reloadAnnotations() {
  annotationStore.resetAnnotationStack();
  await annotationStore.loadAnnotations(currentDocument.value._id,
      currentDocument.value.content, selectedRun.value._id,
      selectedRun.value.corpus.supported_annotation_types, $orbisApiService);
}
</script>
