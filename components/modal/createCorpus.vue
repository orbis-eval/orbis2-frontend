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
      <FileInput :accepted-file-types="acceptedFileTypes" @fileChange="fileChanged" />
      <div>
        <p>File format:</p>
      </div>
      <div class="flex">
        <div class="basis-1/2">
          <div class="form-control">
            <label class="label cursor-pointer justify-normal">
              <input
                  type="radio"
                  name="radio-10"
                  class="radio checked:bg-red-500"
                  value="label-studio"
                  v-model="fileFormat"
              />
              <span class="label-text ml-2">Label Studio (JSON)</span>
            </label>
          </div>
        </div>
        <div class="basis-1/2">
          <div class="form-control">
            <label class="label cursor-pointer justify-normal">
              <input
                  type="radio"
                  name="radio-10"
                  class="radio checked:bg-blue-500"
                  value="doccano"
                  v-model="fileFormat"
              />
              <span class="label-text ml-2">Doccano (JSONL)</span>
            </label>
          </div>
        </div>
      </div>
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
import { toTypedSchema } from "@vee-validate/zod";
import * as zod from "zod";
import { useI18n } from "vue-i18n";
import { useCorpusStore } from "~/stores/corpusStore";

const { t } = useI18n();
const { closeModal } = useModal();
const corpusStore = useCorpusStore();
const { corpora } = storeToRefs(corpusStore);
const cancel = () => closeModal();

const chosenFiles = ref([] as File[]);
const fileFormat = ref("label-studio");

const corpusNotExists = (runName: string) => {
  return !corpora.value.some((corpus) => corpus.name === runName);
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

const acceptedFileTypes = computed(() => {
  if (fileFormat.value === "label-studio") {
    return ".json";
  }
  return ".jsonl";
});

const createCorpus = async (values: any) => {
  try {
    await corpusStore.createCorpus(values.corpusName, chosenFiles.value, fileFormat.value);
  } catch (error) {
    // Todo: Add Error Message
    console.error(error);
  } finally {
    closeModal();
  }
};
</script>
