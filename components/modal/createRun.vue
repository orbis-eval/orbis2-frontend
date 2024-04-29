<template>
  <div>
    <h2 class="mb-5 text-3xl font-bold">{{ $t("run.addRun") }}</h2>
    <Form
      v-slot="{ errors }"
      :validation-schema="validationSchema"
      @submit="createRun"
    >
      <div class="mb-4">
        <label class="mb-1 block">{{ $t("name") }}:</label>
        <Field
          :class="errors.runName ? 'input-bordered input-error' : ''"
          class="input mb-2 w-full bg-gray-100 dark:bg-neutral"
          name="runName"
          type="text"
        />
        <ErrorMessage class="text-red-400" name="runName" />
      </div>
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
import { ErrorMessage, Field, Form } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as zod from "zod";
import { storeToRefs } from "pinia";
import { useI18n } from "vue-i18n";
import { useRunStore } from "~/stores/runStore";
import { Run } from "~/lib/model/run";
import { useCorpusStore } from "~/stores/corpusStore";
import { useMessageToastService } from "~/lib/services/messageToastService";

const { t } = useI18n();
const { closeModal } = useModal();
const { onSuccess, onError } = useMessageToastService();
const runStore = useRunStore();
const corpusStore = useCorpusStore();
const { corpus } = storeToRefs(corpusStore);
const { runs } = storeToRefs(runStore);

const chosenFile = ref({} as File);
const runFileError = ref("");

function fileChanged(newChosenFile: File) {
  chosenFile.value = newChosenFile;
}

const acceptedFileTypes = ".json, .jsonl";

const runNotExists = (runName: string) => {
  return !runs.value.some((run) => run.name === runName);
};

const setRunFileError = (error: any) => {
  runFileError.value = error;
};

const validationSchema = toTypedSchema(
  zod.object({
    runName: zod
      // eslint-disable-next-line @typescript-eslint/naming-convention
      .string({ required_error: t("run.error.runNameRequired") })
      .refine(runNotExists, { message: t("run.error.runExists") }),
  }),
);

const createRun = async (values: any) => {
  try {
    const newRun = new Run({
      name: values.runName,
      description: "",
      corpus: corpus.value,
    });
    await runStore.createRun(newRun, corpus.value, chosenFile.value);
    onSuccess(t("run.success.runCreated"));
    closeModal();
  } catch (error) {
    onError(t("run.error.runCreateError"));
    setRunFileError(t("run.error.runError"));
  }
};
</script>
