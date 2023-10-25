<template>
  <div
    v-if="selectedRun && currentDocument"
    class="flex items-center px-4 pb-4"
  >
    Document: {{ currentDocument._id }}
    <OrbisButton
      class="ml-2"
      :on-click="previousDocument"
      size="xs"
      transparent
    >
      <OhVueIcon name="md-navigatebefore-twotone" /> previous
    </OrbisButton>
    |
    <OrbisButton class="mr-2" :on-click="nextDocument" size="xs" transparent>
      next <OhVueIcon name="md-navigatenext-twotone" />
    </OrbisButton>
    Total Documents in Run: {{ nrOfDocuments }}
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
