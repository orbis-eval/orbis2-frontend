<template>
  <div class="modal-box">
      <h2 class="font-bold text-xl mb-5">Create Run</h2>
      <div class="mb-4">
        <label class="text-white block mb-1 ">Name:</label>
        <input v-model="newRunName" class="input w-full bg-white text-black" required type="text"/>
      </div>
      <div class="mb-4">
        <label class="text-white block mb-1">Description:</label>
        <input v-model="newRunDesc" class="input w-full bg-white text-black" required type="text"/>
      </div>
      <div class="flex justify-end mt-4">
        <button class="btn btn-primary mr-2" @click="createRun">Create</button>
        <button class="btn" @click="emit('cancelledCreateRun')">Cancel</button>
      </div>
    </div>
</template>

<script lang="ts" setup>
import {useRunStore} from "~/stores/runStore";
import {storeToRefs} from "pinia";
import {Run} from "~/lib/model/run";
import {OrbisApiService} from "~/lib/orbisApi/orbisApiService";
import {useCorpusStore} from "~/stores/corpusStore";


const emit = defineEmits(['cancelledCreateRun', 'created']);

const {$orbisApiService} = useNuxtApp() as { $orbisApiService: OrbisApiService };

const runStore = useRunStore();
const {runs} = storeToRefs(runStore);

const corpusStore = useCorpusStore();
const {corpus} = storeToRefs(corpusStore);

const loading = ref(false);

const newRunName = ref("");
const newRunDesc = ref("");

async function createRun() {
  try {
    const newRun = new Run({name: newRunName.value, description: newRunDesc.value, corpus: corpus.value});
    await runStore.createRun(newRun, corpus.value, $orbisApiService);
    emit("created")
  } catch (error) {
    // Todo: Show error to user
    console.error(error);
  }
}

</script>
