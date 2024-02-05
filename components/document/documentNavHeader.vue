<template>
  <div
    v-if="currentDocument"
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
      <span class="font-bold">{{ $t("id") }}:</span>
      {{ currentDocument.identifier }}
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

addIcons(MdNavigatenextTwotone, MdNavigatebeforeTwotone);

const documentStore = useDocumentStore();
const { currentDocument, nrOfDocuments } = storeToRefs(documentStore);
const runStore = useRunStore();
const { selectedRun, selectedGoldStandard } = storeToRefs(runStore);

async function nextDocument() {
  emit("loadingStarted");
  if ("runId" in route.params) {
    await documentStore.nextDocument(selectedRun.value.identifier || -1);
    await navigateTo(
      "/corpora/" +
        route.params.corpusId +
        "/runs/" +
        selectedRun.value.identifier +
        "/documents/" +
        currentDocument.value.identifier,
    );
  } else if ("goldStandardId" in route.params) {
    await documentStore.nextDocument(selectedGoldStandard.value.identifier || -1);
    await navigateTo(
      "/corpora/" +
        route.params.corpusId +
        "/gold-standard/" +
        selectedGoldStandard.value.identifier +
        "/documents/" +
        currentDocument.value.identifier,
    );
  } else {
    console.warn("Id of selected run was not set in nextDocument.");
  }
  emit("loadingFinished");
}

async function previousDocument() {
  emit("loadingStarted");
  if ("runId" in route.params) {
    await documentStore.previousDocument(selectedRun.value.identifier || -1);
    await navigateTo(
      "/corpora/" +
        route.params.corpusId +
        "/runs/" +
        selectedRun.value.identifier +
        "/documents/" +
        currentDocument.value.identifier,
    );
  } else if ("goldStandardId" in route.params) {
    await documentStore.previousDocument(
      selectedGoldStandard.value.identifier || -1,
    );
    await navigateTo(
      "/corpora/" +
        route.params.corpusId +
        "/gold-standard/" +
        selectedGoldStandard.value.identifier +
        "/documents/" +
        currentDocument.value.identifier,
    );
  } else {
    console.warn("Id of selected run was not set in previousDocument.");
  }
  emit("loadingFinished");
}
</script>
