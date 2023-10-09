<template>
  <DialogWarning 
    title="Delete corpus?" 
    :message="`Deleting corpus with ${corpus.name} will remove all documents and runs of this corpus! Do you want to continue?`" 
    confirm-text="ok" 
    declineText="cancel"
    :onConfirm="confirm"
    :onDecline="decline"
    :event-bus-name="props.eventBusName"
  />
</template>

<script lang="ts" setup>
import { Corpus } from "~/lib/model/corpus";
import { useCorpusStore } from "~/stores/corpusStore";
import { OrbisApiService } from "~/lib/orbisApi/orbisApiService";

const props = defineProps({
  corpus: Corpus,
  eventBusName: { type: String, default: '' }
});

const { $orbisApiService } = useNuxtApp() as { $orbisApiService: OrbisApiService };
const corpusStore = useCorpusStore();

async function confirm() {
  if (props.corpus instanceof Corpus) {
    try {
      await corpusStore.deleteCorpora(props.corpus, $orbisApiService);
    } catch (Error) {
      // Todo: Add Error Message
      console.error(Error);
    }
  }
}

const decline = () => {};

</script>