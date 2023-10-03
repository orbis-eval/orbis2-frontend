<template>
  <DialogWarning
    :message="`Deleting run with ${run.name} will remove the run from this corpus! Do you want to continue?`"
    confirm-text="ok"
    declineText="cancel"
    title="Delete run?"
    :onConfirm="confirm"
    :onDecline="decline"
    :event-bus-name="props.eventBusName"
  />
</template>

<script lang="ts" setup>
import {useRunStore} from "~/stores/runStore";
import {Run} from "~/lib/model/run";

const props = defineProps({
  run: Run,
  eventBusName: { type: String, default: '' }
});

const { $orbisApiService } = useNuxtApp();

const runStore = useRunStore();

async function confirm() {
  try {
    await runStore.removeRun(props.run, $orbisApiService);
  } catch (error) {
    // @Todo: Show error message to user
    console.error(error);
  }
}

const decline = () => {}
</script>
