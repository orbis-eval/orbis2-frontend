<template>
  <OrbisWarning
    :confirm-text="$t('button.ok')"
    :decline-text="$t('button.cancel')"
    :message="$t('corpus.delete.warning', { name: propsObject.name })"
    :title="$t('corpus.delete.warningTitle')"
    :on-confirm="deletionConfirmed"
    :on-decline="closeModal"
  />
</template>

<script lang="ts" setup>
import { Corpus } from "~/lib/model/corpus";
import { useCorpusStore } from "~/stores/corpusStore";
import { MessageToastType } from "~/lib/types/MessageToastSettings";

const corpusStore = useCorpusStore();
const { closeModal } = useModal();
const { showToast } = useMessageToast();
const { t } = useI18n();

const props = defineProps<{
  /**
   * propsObject is being used by Modal component
   */
  propsObject: Corpus;
}>();

const deletionConfirmed = async () => {
  try {
    await corpusStore.deleteCorpus(props.propsObject);
  } catch (error) {
    showToast({
      message: t("corpus.error.corpusDeleteError"),
      type: MessageToastType.ERROR,
    });
  } finally {
    closeModal();
  }
};
</script>
