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
import { MessageToastType } from "~/lib/types/MessageToastSettings";

const { t } = useI18n();
const { openModal, closeModal } = useModal();
const { showToast } = useMessageToast();

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
  } catch (error) {
    showToast({
      message: t("run.error.runDeleteError"),
      type: MessageToastType.ERROR,
    });
  } finally {
    onDecline();
  }
};
</script>
