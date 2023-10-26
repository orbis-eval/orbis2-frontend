<template>
  <div
    v-if="selectedRun && currentDocument"
    class="flex items-center px-4 pb-4 pt-5 text-lg"
  >
    <OrbisButton
      :disabled="nrOfDocuments <= 1"
      :on-click="previousDocument"
      class="p-0"
      size="md"
      transparent
    >
      <OhVueIcon name="md-navigatebefore-twotone" scale="2.5" />
    </OrbisButton>
    <div class="grow text-center">
      <span class="font-bold">ID:</span> {{ currentDocument._id }}
    </div>
    <OrbisButton
      :disabled="nrOfDocuments <= 1"
      :on-click="nextDocument"
      class="p-0"
      size="md"
      transparent
    >
      <OhVueIcon name="md-navigatenext-twotone" scale="2.5" />
    </OrbisButton>
  </div>
</template>

<script lang="ts" setup>
import {
  MdNavigatebeforeTwotone,
  MdNavigatenextTwotone,
} from "oh-vue-icons/icons";
import { storeToRefs } from "pinia";
import { addIcons, OhVueIcon } from "oh-vue-icons";
import { useDocumentStore } from "~/stores/documentStore";
import { useRunStore } from "~/stores/runStore";

const route = useRoute();

const emit = defineEmits(["loadingStarted", "loadingFinished"]);

const { $orbisApiService } = useNuxtApp();
addIcons(MdNavigatenextTwotone, MdNavigatebeforeTwotone);

const documentStore = useDocumentStore();
const { currentDocument, nrOfDocuments } = storeToRefs(documentStore);
const runStore = useRunStore();
const { selectedRun } = storeToRefs(runStore);

async function nextDocument() {
  emit("loadingStarted");
  if (selectedRun.value._id) {
    await documentStore.nextDocument(selectedRun.value._id, $orbisApiService);
    await navigateTo(
      "/corpora/" +
        route.params.corpusId +
        "/documents/" +
        currentDocument.value._id,
    );
  } else {
    console.warn("Id of selected run was not set in nextDocument.");
  }
  emit("loadingFinished");
}

async function previousDocument() {
  emit("loadingStarted");
  if (selectedRun.value._id) {
    await documentStore.previousDocument(
      selectedRun.value._id,
      $orbisApiService,
    );
    await navigateTo(
      "/corpora/" +
        route.params.corpusId +
        "/documents/" +
        currentDocument.value._id,
    );
  } else {
    console.warn("Id of selected run was not set in previousDocument.");
  }
  emit("loadingFinished");
}
</script>
