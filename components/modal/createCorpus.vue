<template>
  <div>
    <h2 class="mb-5 text-3xl font-bold">{{ $t("corpus.create") }}</h2>
    <Form
      v-slot="{ errors }"
      :validation-schema="validationSchema"
      @submit="createCorpus"
    >
      <div class="mb-4">
        <label class="mb-1 block text-white">{{ $t("name") }}:</label>
        <Field
          :class="errors.corpusName ? 'input-bordered input-error' : ''"
          class="input mb-2 w-full bg-white text-black"
          name="corpusName"
          type="text"
        />
        <ErrorMessage class="text-red-400" name="corpusName" />
      </div>
      <FileInput
        :accepted-file-types="acceptedFileTypes"
        @fileChange="fileChanged"
      />
      <div class="mt-5 flex gap-4">
        <OrbisButton :is-form-button="true"
          >{{ $t("button.create") }}
        </OrbisButton>
        <OrbisButton :on-click="cancel">{{ $t("button.cancel") }}</OrbisButton>
      </div>
    </Form>
  </div>
</template>

<script lang="ts" setup>
import { ErrorMessage, Field, Form } from "vee-validate";
import { useI18n } from "vue-i18n";
import { toTypedSchema } from "@vee-validate/zod";
import * as zod from "zod";
import { useCorpusStore } from "~/stores/corpusStore";

const { t } = useI18n();

const { closeModal } = useModal();
const corpusStore = useCorpusStore();
const { corpora } = storeToRefs(corpusStore);
const cancel = () => closeModal();

const chosenFiles = ref([] as File[]);
const corpusFileError = ref("");

const corpusNotExists = (runName: string) => {
  return !corpora.value.some((corpus) => corpus.name === runName);
};

const setCorpusFileError = (error: any) => {
  corpusFileError.value = error;
};

const validationSchema = toTypedSchema(
  zod.object({
    corpusName: zod
      // eslint-disable-next-line @typescript-eslint/naming-convention
      .string({ required_error: t("corpus.error.corpusNameRequired") })
      .refine(corpusNotExists, {
        message: t("corpus.error.corpusExists"),
      }),
  }),
);

function fileChanged(newChosenFiles: File[]) {
  chosenFiles.value = newChosenFiles;
}

const acceptedFileTypes = ".json, .jsonl";

const createCorpus = async (values: any) => {
  try {
    await corpusStore.createCorpus(values.corpusName, chosenFiles.value);

    closeModal();
  } catch (error: any) {
    setCorpusFileError(t("corpus.error.corpusError"));
  }
};
</script>
