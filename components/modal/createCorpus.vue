<template>
  <div>
    <h2 class="font-bold text-3xl mb-5">Create Corpus</h2>
    <div class="flex justify-between mb-6">
      <div class="text-lg font-medium p-1">
        Name of Corpus
      </div>
      <input class="bg-gray-700 p-1" @input="setCorpusName"/>
    </div>
    <FileInput @fileChange="fileChanged"/>
    <div class="flex gap-4 mt-5">
      <OrbisButton id="submit" :onClick="createCorpus">Create</orbisButton>
      <OrbisButton id="cancel" :onClick="cancel">cancel</orbisButton>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {useCorpusStore} from "~/stores/corpusStore";

const {$orbisApiService} = useNuxtApp();
const {closeModal} = useModal();
const corpusStore = useCorpusStore();
const cancel = () => closeModal();

const corpusNameToCreate = ref("");
let chosenFiles = ref([] as File[]);


function fileChanged(newChosenFiles: File[]) {
  chosenFiles.value = newChosenFiles;
}

function setCorpusName(event: Event) {
  if (event.target instanceof HTMLInputElement) {
    corpusNameToCreate.value = event.target.value;
  }
}

const createCorpus = async () => {
  try {
    await corpusStore.createCorpus(corpusNameToCreate.value, chosenFiles.value, $orbisApiService);
  } catch (Error) {
    // Todo: Add Error Message
    console.error(Error);
  } finally {
    closeModal();
  }
};
</script>
