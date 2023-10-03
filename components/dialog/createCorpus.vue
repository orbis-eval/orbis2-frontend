<template>
  <OrbisDialog :event-bus-name="props.eventBusName">
    <template v-slot:body>
      <FileInput cancelText="cancel" submitText="import" :onSubmit="createCorpus" :onCancel="cancel" />
    </template>
  </OrbisDialog>
</template>

<script lang="ts" setup>
import { useCorpusStore } from "~/stores/corpusStore";

const { $orbisApiService, $busEmit } = useNuxtApp();
const corpusStore = useCorpusStore();

const handleeventBusName = () => {
  if (props.eventBusName && props.eventBusName.length > 0) {
    $busEmit(props.eventBusName)
  }
}

const props = defineProps({
  eventBusName: { type: String, default: '' }
});

async function createCorpus(corpusName: string, chosenFiles: File[]) {
  try {
    await corpusStore.addCorpus(corpusName, chosenFiles, $orbisApiService);
  } catch (Error) {
    // Todo: Add Error Message
  } finally {
    handleeventBusName()
  }
}
const cancel = () => handleeventBusName()
</script>