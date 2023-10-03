<template>
  <OrbisDialog :event-bus="props.eventBus">
    <template v-slot:body>
      <FileInput cancelText="cancel" submitText="import" :onSubmit="createCorpus" :onCancel="cancel" />
    </template>
  </OrbisDialog>
</template>

<script lang="ts" setup>
import { useCorpusStore } from "~/stores/corpusStore";

const { $orbisApiService, $busEmit } = useNuxtApp();
const corpusStore = useCorpusStore();

const handleEventBus = () => {
  if (props.eventBus && props.eventBus.length > 0) {
    $busEmit(props.eventBus)
  }
}

const props = defineProps({
  eventBus: { type: String, default: '' }
});

async function createCorpus(corpusName: string, chosenFiles: File[]) {
  try {
    await corpusStore.addCorpus(corpusName, chosenFiles, $orbisApiService);
  } catch (Error) {
    // Todo: Add Error Message
  } finally {
    handleEventBus()
  }
}
const cancel = () => handleEventBus()
</script>