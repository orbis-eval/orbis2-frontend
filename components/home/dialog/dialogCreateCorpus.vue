<template>
  <div>
    <dialog id="create_corpus" ref="createCorpusDialog" class="modal">
      <form class="modal-box" method="dialog">
        <FileInput cancelText="cancel"
                   submitText="import" @submitted="createCorpus"/>
      </form>
    </dialog>
  </div>
</template>

<script lang="ts" setup>
import {useCorpusStore} from "~/stores/corpusStore";

const emit = defineEmits(['started', 'finished']);
defineExpose({showDialog})

const {$orbisApiService} = useNuxtApp();
const corpusStore = useCorpusStore();

const createCorpusDialog = ref(null);

function showDialog() {
  createCorpusDialog.value.showModal();
}


async function createCorpus(corpusName: string, chosenFiles: File[]) {
  try {
    emit('started');
    await corpusStore.addCorpus(corpusName, chosenFiles, $orbisApiService);
  } catch (Error) {
    // Todo: Add Error Message
  } finally {
    emit('finished');
  }
}
</script>