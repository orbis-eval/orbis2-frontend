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
import { OrbisApiService } from "~/lib/orbisApi/orbisApiService";

const { $orbisApiService } = useNuxtApp() as {
  $orbisApiService: OrbisApiService;
};
const corpusStore = useCorpusStore();
const { closeModal } = useModal();

const props = defineProps<{
  /**
   * propsObject is being used by Modal component
   */
  propsObject: Corpus;
}>();

const deletionConfirmed = async () => {
  try {
    await corpusStore.deleteCorpus(props.propsObject, $orbisApiService);
  } catch (error) {
    // Todo: Add Error Message
    console.error(error);
  } finally {
    closeModal();
  }
};
</script>
