<template>
  <Warning
        :message="`Deleting corpus with '${propsObject.name}' will remove all documents and runs of this corpus! Do you want to continue?`"
        confirm-text="ok"
        declineText="cancel"
        title="Delete corpus?"
        :onConfirm="deletionConfirmed"
        :onDecline="closeModal"/>
</template>

<script lang="ts" setup>
import {Corpus} from "~/lib/model/corpus";
import {useCorpusStore} from "~/stores/corpusStore";
import {OrbisApiService} from "~/lib/orbisApi/orbisApiService";

const { $orbisApiService } = useNuxtApp() as { $orbisApiService: OrbisApiService };
const corpusStore = useCorpusStore();
const { closeModal } = useModal();

const props = defineProps<{
  /**
   * propsObject is being used by Modal component
   */
  propsObject: Corpus
}>();

const deletionConfirmed = async () => {
  try {
    await corpusStore.deleteCorpus(props.propsObject, $orbisApiService);
  } catch (Error) {
    // Todo: Add Error Message
    console.error(Error);
  } finally {
    closeModal();
  }
}
</script>