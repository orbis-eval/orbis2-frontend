<template>
  <OrbisDialog :event-bus="props.eventBus">
    <template v-slot:body>
      <FileInput cancelText="cancel" submitText="import" @submitted="createCorpus" @cancelled="cancel" />
    </template>
  </OrbisDialog>
</template>

<script lang="ts" setup>
import { useCorpusStore } from "~/stores/corpusStore";

const { $orbisApiService } = useNuxtApp();
const { $busEmit } = useNuxtApp()
const emit = defineEmits(['loading']);
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
    emit('loading', true);
    await corpusStore.addCorpus(corpusName, chosenFiles, $orbisApiService);
  } catch (Error) {
    // Todo: Add Error Message
  } finally {
    emit('loading', false);
    handleEventBus()
  }
}
async function cancel() {
  handleEventBus()
}
</script>