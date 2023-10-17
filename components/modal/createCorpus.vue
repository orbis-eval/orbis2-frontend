<template>
  <div>
    <h2 class="font-bold text-3xl mb-5">Create Corpus</h2>
    <FileInput cancelText="cancel" submitText="Create" :onSubmit="createCorpus" :onCancel="cancel" />
  </div>
</template>

<script lang="ts" setup>
import {useCorpusStore} from "~/stores/corpusStore";

const { $orbisApiService } = useNuxtApp();
const { closeModal } = useModal();
const corpusStore = useCorpusStore();
const cancel = () => closeModal();
const createCorpus = async (corpusName: string, chosenFiles: File[]) => {
  try {
    await corpusStore.addCorpus(corpusName, chosenFiles, $orbisApiService);
  } catch (Error) {
    // Todo: Add Error Message
    console.error(Error);
  } finally {
    closeModal();
  }
};
</script>
