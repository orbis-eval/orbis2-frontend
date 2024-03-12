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
import { useMessageToastService } from "~/lib/services/messageToastService";

const corpusStore = useCorpusStore();
const { closeModal } = useModal();
const { onSuccess, onError } = useMessageToastService();
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
    onSuccess(t("corpus.success.corpusDeleted"));
  } catch (error) {
    onError(t("corpus.error.corpusDeleteError"));
  } finally {
    closeModal();
  }
};
</script>
