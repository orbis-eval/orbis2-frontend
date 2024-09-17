<template>
  <div>
    <h2 class="mb-5 text-3xl font-bold">{{ $t("goldStandard.update") }}</h2>
    <Form @submit="updateGoldStandard">
      <FileInput
        :accepted-file-types="acceptedFileTypes"
        @fileChange="fileChanged"
      />
      <div class="mt-10 grid grid-cols-3 gap-4">
        <OrbisButton :is-form-button="true"
          >{{ $t("button.import") }}
        </OrbisButton>
        <OrbisButton :on-click="() => closeModal()"
          >{{ $t("button.cancel") }}
        </OrbisButton>
      </div>
    </Form>
  </div>
</template>

<script lang="ts" setup>
import { Form } from "vee-validate";
import { useI18n } from "vue-i18n";
import { useGoldStandardStore } from "~/stores/goldStandardStore";
import { useCorpusStore } from "~/stores/corpusStore";

const { t } = useI18n();
const { closeModal } = useModal();
const goldStandardStore = useGoldStandardStore();
const corpusStore = useCorpusStore();
const { corpus } = storeToRefs(corpusStore);

const chosenFile = ref({} as File);
const runFileError = ref("");

function fileChanged(newChosenFile: File) {
  chosenFile.value = newChosenFile;
}

const acceptedFileTypes = ".json, .jsonl";

const setRunFileError = (error: any) => {
  runFileError.value = error;
};

const updateGoldStandard = async () => {
  try {
    await goldStandardStore.updateGoldStandard(corpus.value, chosenFile.value);

    closeModal();
  } catch (error) {
    setRunFileError(t("run.error.runError"));
  }
};
</script>
