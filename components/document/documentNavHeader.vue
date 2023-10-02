<template>
  <div v-if="selectedRun && currentDocument" class="p-4 flex items-center">
    Document: {{ currentDocument._id }}
    <OrbisButton class="ml-2" @click="previousDocument" size="xs" transparent>
      <OhVueIcon name="md-navigatebefore-twotone"/> previous
    </OrbisButton>
    |
    <OrbisButton class="mr-2" @click="nextDocument" size="xs" transparent>
      next <OhVueIcon name="md-navigatenext-twotone"/>
    </OrbisButton>
    Total Documents in Run: {{ nrOfDocuments }}
  </div>
</template>

<script lang="ts" setup>

const route = useRoute();

import {
  MdNavigatebeforeTwotone,
  MdNavigatenextTwotone,
} from "oh-vue-icons/icons";
import {useDocumentStore} from "~/stores/documentStore";
import {storeToRefs} from "pinia";
import {useRunStore} from "~/stores/runStore";
import {addIcons, OhVueIcon} from "oh-vue-icons";

const emit = defineEmits(['loadingStarted', 'loadingFinished']);

const {$orbisApiService} = useNuxtApp();
addIcons(MdNavigatenextTwotone, MdNavigatebeforeTwotone);

const documentStore = useDocumentStore();
const {currentDocument, nrOfDocuments} = storeToRefs(documentStore);
const runStore = useRunStore();
const {selectedRun} = storeToRefs(runStore);

async function nextDocument() {
  emit('loadingStarted');
  await documentStore.nextDocument(selectedRun.value._id, $orbisApiService);
  await navigateTo('/corpora/' + route.params.corpusId + '/documents/' + currentDocument.value._id);
  emit('loadingFinished');
}

async function previousDocument() {
  emit('loadingStarted');
  await documentStore.previousDocument(selectedRun.value._id, $orbisApiService);
  await navigateTo('/corpora/' + route.params.corpusId + '/documents/' + currentDocument.value._id);
  emit('loadingFinished');
}
</script>
