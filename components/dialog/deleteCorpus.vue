<template>
  <DialogWarning 
    title="Delete corpus?" 
    :message="`Deleting corpus with ${corpus.name} will remove all documents and runs of this corpus! Do you want to continue?`" 
    confirm-text="ok" 
    declineText="cancel"
    :onConfirm="confirm"
    :onDecline="decline"
    :event-bus="props.eventBus"
  />
</template>

<script lang="ts" setup>
import { Corpus } from "~/lib/model/corpus";
import { useCorpusStore } from "~/stores/corpusStore";

const { $orbisApiService } = useNuxtApp();
const corpusStore = useCorpusStore();

const props = defineProps({
  corpus: Corpus,
  eventBus: { type: String, default: '' }
});

async function confirm() {
  if (props.corpus instanceof Corpus) {
    try {
      await corpusStore.deleteCorpora(props.corpus, $orbisApiService);
    } catch (Error) {
      // Todo: Add Error Message
    }
  }
}

const decline = () => {}

</script>