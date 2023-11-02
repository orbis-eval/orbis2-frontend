<template>
  <OrbisWarning
    :message="`Deleting run with '${propsObject.name}' will remove the run from this corpus! Do you want to continue?`"
    confirm-text="ok"
    decline-text="cancel"
    title="Delete run?"
    :on-confirm="deletionConfirmed"
    :on-decline="onDecline"
  />
</template>

<script lang="ts" setup>
import ModalListRuns from "~/components/modal/listRuns.vue";

import { useRunStore } from "~/stores/runStore";
import { Run } from "~/lib/model/run";
import { OrbisApiService } from "~/lib/orbisApi/orbisApiService";
const { $orbisApiService } = useNuxtApp() as {
  $orbisApiService: OrbisApiService;
};

const { openModal, closeModal } = useModal();
const runStore = useRunStore();

const props = defineProps<{
  /**
   * propsObject is being used by Modal component
   */
  propsObject: Run;
}>();

const onDecline = () => {
  closeModal();
  openModal(ModalListRuns);
};

const deletionConfirmed = async () => {
  try {
    await runStore.deleteRun(props.propsObject, $orbisApiService);
  } catch (error) {
    // @Todo: Show error message to user
    console.error(error);
  } finally {
    onDecline();
  }
};
</script>
