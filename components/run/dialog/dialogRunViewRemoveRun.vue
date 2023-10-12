<template>
  <div class="modal-box">
    <Warning
        :message="`Deleting run with ${runToDelete.name} will remove the run from this corpus! Do you want to continue?`"
        confirm-text="ok"
        declineText="cancel"
        title="Delete run?"
        @confirm="deletionConfirmed"
        @decline="$emit('deletionDeclined')"/>
  </div>
</template>

<script lang="ts" setup>
import {useRunStore} from "~/stores/runStore";
import {storeToRefs} from "pinia";
import {Run} from "~/lib/model/run";
import {OrbisApiService} from "~/lib/orbisApi/orbisApiService";


const emit = defineEmits(['deletionDeclined', 'deleted']);
const props = defineProps({
  runToDelete: {
    type: Run,
    required: true
  }
});

const {$orbisApiService} = useNuxtApp() as { $orbisApiService: OrbisApiService };

const runStore = useRunStore();
const {runs} = storeToRefs(runStore);

const loading = ref(false);

async function deletionConfirmed() {
  try {
    loading.value = true;
    await runStore.removeRun(props.runToDelete, $orbisApiService);
    emit('deleted');
  } catch (error) {
    // @Todo: Show error message to user
    console.error(error);
  } finally {
    loading.value = false;
  }
}
</script>
