<template>
  <div>
    <dialog id="delete_corpus" ref="deleteCorpus" class="modal">
      <form class="modal-box" method="dialog">
        <Warning :message="String(deletionMessage)"
                 :title="String(deletionTitle)"
                 confirm-text="ok" declineText="cancel"
                 @confirm="deletionConfirmed"/>
      </form>
    </dialog>
  </div>
</template>

<script lang="ts" setup>
import {Corpus} from "~/lib/model/corpus";
import {useCorpusStore} from "~/stores/corpusStore";

const emit = defineEmits(['started', 'finished']);
defineExpose({showDialog});

const {$orbisApiService} = useNuxtApp();
const corpusStore = useCorpusStore();

const deletionTitle = ref("");
const deletionMessage = ref("");
const corpusUnderDeletion = ref(null);
const deleteCorpus = ref(null)

function showDialog(corpus: Corpus) {
  deletionTitle.value = "Delete corpus?";
  deletionMessage.value = `Deleting corpus with "${corpus.name}" will remove all documents and runs of this corpus!
  Do you want to continue?`;
  corpusUnderDeletion.value = corpus;
  deleteCorpus.value.showModal()
}

async function deletionConfirmed() {
  if (corpusUnderDeletion.value instanceof Corpus) {
    try {
      // Todo: Check if another loading spinner is more appropriate
      emit('started');
      await corpusStore.deleteCorpora(corpusUnderDeletion.value, $orbisApiService);
      corpusUnderDeletion.value = null;
    } catch (Error) {
      // Todo: Add Error Message
    } finally {
      emit('finished');
    }
  }
}
</script>