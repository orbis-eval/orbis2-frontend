<template>
  <OrbisDialog title="Create Run" :event-bus-name="props.eventBusName" :isLoading="isLoading">
    <template v-slot:body>
      <div class="mb-4">
        <label class="text-white block mb-1 ">Name:</label>
        <input v-model="newRunName" class="input w-full bg-white text-black" required type="text" />
      </div>
      <div class="mb-4">
        <label class="text-white block mb-1">Description:</label>
        <input v-model="newRunDesc" class="input w-full bg-white text-black" required type="text" />
      </div>
    </template>
    <template v-slot:footer>
      <OrbisButton :onClick="createRun">Create</OrbisButton>
      <OrbisButton :event-bus-name="props.eventBusName">Cancel</OrbisButton>
    </template>
  </OrbisDialog>
</template>

<script lang="ts" setup>
import { useRunStore } from "~/stores/runStore";
import { storeToRefs } from "pinia";
import { Run } from "~/lib/model/run";
import { OrbisApiService } from "~/lib/orbisApi/orbisApiService";
import { useCorpusStore } from "~/stores/corpusStore";

const { $orbisApiService } = useNuxtApp() as { $orbisApiService: OrbisApiService };
const { $busEmit } = useNuxtApp()

const runStore = useRunStore();

const corpusStore = useCorpusStore();
const { corpus } = storeToRefs(corpusStore);

const newRunName = ref("");
const newRunDesc = ref("");
const isLoading = ref(false);

const handleeventBusName = () => {
  if (props.eventBusName && props.eventBusName.length > 0) {
    $busEmit(props.eventBusName)
  }
}

async function createRun() {
  try {
    isLoading.value = true;
    const newRun = new Run({ name: newRunName.value, description: newRunDesc.value, corpus: corpus.value });
    await runStore.createRun(newRun, corpus.value, $orbisApiService);
  } catch (error) {
    // Todo: Show error to user
    console.error(error);
  }
  finally {
    isLoading.value = false;
    handleeventBusName();
  }
}

const props = defineProps({
    eventBusName: { type: String, default: '' }
})

</script>
