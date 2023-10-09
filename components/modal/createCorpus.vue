<template>
  <OrbisModal :event-bus-name="props.eventBusName">
    <template v-slot:body>
      <FileInput cancelText="cancel" submitText="import" :onSubmit="createCorpus" :onCancel="cancel" />
    </template>
  </OrbisModal>
</template>

<script lang="ts" setup>
import { useCorpusStore } from "~/stores/corpusStore";

const props = defineProps({
  eventBusName: { type: String, default: '' }
});
const { $orbisApiService, $busEmit } = useNuxtApp();
const corpusStore = useCorpusStore();

const handleEventBusName = () => {
  if (props.eventBusName.length > 0) {
    $busEmit(props.eventBusName);
  }
}

async function createCorpus(corpusName: string, chosenFiles: File[]) {
  try {
    await corpusStore.addCorpus(corpusName, chosenFiles, $orbisApiService);
  } catch (Error) {
    // Todo: Add Error Message
    console.error(Error);
  } finally {
    handleEventBusName();
  }
}
const cancel = () => handleEventBusName();
</script>