<template>
  <Warning
        :message="`Deleting run with ${propsObject.name} will remove the run from this corpus! Do you want to continue?`"
        confirm-text="ok"
        declineText="cancel"
        title="Delete run?"
        :onConfirm="deletionConfirmed"
        :onDecline="onDecline"/>
</template>

<script lang="ts" setup>
import ModalListRuns from "~/components/modal/listRuns.vue";

import {useRunStore} from "~/stores/runStore";
import {Run} from "~/lib/model/run";
import {OrbisApiService} from "~/lib/orbisApi/orbisApiService";
const { $orbisApiService } = useNuxtApp() as { $orbisApiService: OrbisApiService };

const { openModal, closeModal } = useModal();
const runStore = useRunStore();

const props = defineProps({
  propsObject: {
    type: Run,
    required: true
  }
});

const onDecline = () => {
  closeModal();
  openModal(ModalListRuns);
};

const deletionConfirmed = async () => {
  try {
    await runStore.removeRun(props.propsObject, $orbisApiService);
  } catch (error) {
    // @Todo: Show error message to user
    console.error(error);
  } finally {
    onDecline()
  }
}
</script>
