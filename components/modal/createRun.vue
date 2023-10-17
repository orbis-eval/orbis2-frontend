<template>
  <div>
    <h2 class="font-bold text-3xl mb-5">Create run</h2>
    <div class="mb-4">
      <label class="text-white block mb-1 ">Name:</label>
      <input v-model="newRunName" class="input w-full bg-white text-black" required type="text" />
    </div>
    <div class="mb-4">
      <label class="text-white block mb-1">Description:</label>
      <input v-model="newRunDesc" class="input w-full bg-white text-black" required type="text" />
    </div>
    <div class="grid grid-cols-3 gap-4 mt-10">
      <OrbisButton :onClick="createRun">Create</OrbisButton>
      <OrbisButton :onClick="() => closeModal()">Cancel</OrbisButton>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {useRunStore} from "~/stores/runStore";
import {storeToRefs} from "pinia";
import {Run} from "~/lib/model/run";
import {OrbisApiService} from "~/lib/orbisApi/orbisApiService";
import {useCorpusStore} from "~/stores/corpusStore";

const {$orbisApiService} = useNuxtApp() as { $orbisApiService: OrbisApiService };
const {closeModal} = useModal();
const runStore = useRunStore();
const corpusStore = useCorpusStore();
const {corpus} = storeToRefs(corpusStore);
const newRunName = ref("");
const newRunDesc = ref("");
const createRun = async () => {
  try {
    const newRun = new Run({ name: newRunName.value, description: newRunDesc.value, corpus: corpus.value });
    await runStore.createRun(newRun, corpus.value, $orbisApiService);
  } catch (error) {
    // Todo: Show error to user
    console.error(error);
  }
  finally {
    closeModal();
  }
}
</script>
