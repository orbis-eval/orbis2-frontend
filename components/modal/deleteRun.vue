<template>
  <OrbisWarning
    :confirm-text="$t('button.ok')"
    :decline-text="$t('button.cancel')"
    :message="$t('run.delete.warning', { name: propsObject.name })"
    :title="$t('run.delete.warningTitle')"
    :on-confirm="deletionConfirmed"
    :on-decline="onDecline"
  />
</template>

<script lang="ts" setup>
import ModalListRuns from "~/components/modal/listRuns.vue";

import { useRunStore } from "~/stores/runStore";
import { Run } from "~/lib/model/run";
import { useMessageToastService } from "~/lib/services/messageToastService";

const { t } = useI18n();
const { openModal, closeModal } = useModal();
const { onSuccess, onError } = useMessageToastService();

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
    await runStore.deleteRun(props.propsObject);
    onSuccess(t("run.success.runDeleted"));
    closeModal();
  } catch (error) {
    onError(t("run.error.runDeleteError"));
  } finally {
    onDecline();
  }
};
</script>
